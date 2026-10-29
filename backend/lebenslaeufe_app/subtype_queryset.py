from typing import Collection, Self

from django.db import models
from django.db.models import Exists, Q, OuterRef
from django.db.models.constants import LOOKUP_SEP
from django.db.models.query import ModelIterable


class SubtypeQuerySet(models.QuerySet):
    """
    A QuerySet which can optionally return subtypes of its model instead of just the model itself.
    """

    subtype_qs: Collection[models.QuerySet] = ()

    def _clone(self):
        # noinspection PyProtectedMember
        clone = super()._clone()
        clone.subtype_qs = self.subtype_qs or ()
        return clone

    def with_subtypes(
        self, subtype_qs: Collection[tuple[models.QuerySet, models.QuerySet]]
    ) -> Self:
        """
        Turn this QuerySet into one that returns subtypes of its model instead.
        Every item in subtype_qs must be a tuple of filter_qs, fetch_qs describing
        one subtype.
        filter_qs is the QuerySet of objects to be returned by that subtype, i.e. a QuerySet with
            filters applied.
        fetch_qs is a QuerySet of the same model as filter_qs, but unfiltered. It will be used to
            retrieve the actual objects of the subtype.
        """

        # We only want to return rows of the parent table, where we have
        # one of the subtypes for it
        # Loop over subtype_qs and for every subtype, build and Exists filter that checks
        # if that subtype is present.
        # At the end, OR all the filters together.
        filters = []
        fetch_qs_list = []
        for filter_qs, fetch_qs in subtype_qs:
            if filter_qs.model != fetch_qs.model:
                raise ValueError(
                    f'Mismatched models between filter_qs and fetch_qs, got '
                    f'{filter_qs.model.__name__} and {fetch_qs.model.__name__}'
                )
            path_to_parent = filter_qs.model._meta.get_path_to_parent(self.model)
            if not path_to_parent:
                raise ValueError(
                    f'Subtype model {filter_qs.model.__name__} is not a subtype '
                    f'of {self.model.__name__}'
                )
            parent_pk = LOOKUP_SEP.join(p.join_field.attname for p in path_to_parent)
            filters.append(Exists(filter_qs.filter(Q((parent_pk, OuterRef('pk'))))))
            fetch_qs_list.append(fetch_qs)

        result = self.filter(Q.create(children=filters, connector=Q.OR))
        result.subtype_qs = fetch_qs_list
        return result

    def _fetch_all(self):
        if not self.subtype_qs or not issubclass(self._iterable_class, ModelIterable):
            super()._fetch_all()
        elif self._result_cache is None:
            # first fetch all the primary keys, so we have the correct order
            pks = self.values_list('pk', flat=True)
            pks = list(pks)

            # for every subtype, fetch the actual instances
            sub_objs = {
                obj.pk: obj for qs in self.subtype_qs for obj in qs.filter(pk__in=pks)
            }
            self._result_cache = [sub_objs[pk] for pk in pks]
