# Projektstruktur

## Backend

Im Backend kommt das Python-Framework [Django](https://www.djangoproject.com/) in Version
5.2 zum Einsatz.
Das mitgelieferte Admin-Framework wird zusammen mit [Django Unfold](https://unfoldadmin.com/)
genutzt, um eine Administrationsoberfläche zur Verfügung zu stellen.

Das Backend stellt eine [GraphQL](https://graphql.org/)-API zur Verfügung, welche mit der
[Strawberry Bibliothek](https://strawberry.rocks/) erstellt wird.

### Umfragesystem

Die Anbindung von Umfragesystemen erfolgt als eigenständige [Django App](https://docs.djangoproject.com/en/5.2/ref/applications/).

Im Folgenden wird beschrieben, wie ein Umfragesystem anzubinden ist.

#### 1. App Config

Die `AppConfig` der Django App muss von `lla_questionnaire.qnr_system_apps.QnrSystemAppConfig` erben.
Die Property `questionnaire_types` muss implementiert werden und die Umfragetypen zurückgeben (sh. Schritt 2).

```py
class MyAppConfig(QnrSystemAppConfig, AppConfig):
    @cached_property
    def questionnaire_types(self) -> Sequence[QnrTypeDefinition]:
        return (ZofarQuestionnaireType(),)
```

#### 2. Umfragetypen

Ein Umfragesystem muss mindestens einen Umfragetypen bereitstellen. Ein Umfragetyp besteht zunächst aus mindestens einem Django Datenbank-Modell, dem `PersonQuestionnaire`.
Eine `PersonQuestionnaire` Instanz repräsentiert die Zuordnung einer Umfrage zu einer Person. Umfragen werden repräsentiert durch `Questionnaire`, Personen werden repräsentiert durch
`Person`. Es ist wahrscheinlich, dass ein Umfragesystem Kind-Modelle für `Questionnaire` und `Person` erstellt, dies ist jedoch nicht zwingend erforderlich.

```py
class MyPersonQuestionnaire(PersonQuestionnaire):
    person = models.ForeignKey(Person)
    questionnaire = models.ForeignKey(Questionnaire)
```

Weiterhin muss ein GraphQL-Typ bereitgestellt werden, welcher das interface `QuestionnaireGql` implementiert:
```py
@strawberry_django.type(MyPersonQuestionnaire, name='MyQuestionnaire')
class MyQuestionnaireGql(QuestionnaireGql):
    ...
```


Ein Umfragetyp wird repräsentiert durch `QnrTypeDefinition`, ein Umfragesystem muss mindestens eine dieser Definitionen bereitstellen:
```py
class MyQuestionnaireType(QnrTypeDefinition):
    person_questionnaire_gql = MyQuestionnaireGql
```

Die Methoden des `QnrTypeDefinition` Interfaces müssen entsprechend der Code-Dokumentation implementiert werden. 
Zofar im Package `lla_zofar` kann als Vorlage genutzt werden.

## Frontend

### Technologien
- Das Frontend nutzt das SPA-Framework [Angular](https://angular.dev/) in Version 20. Für optimale Performance wird ausschließlich `OnPush` 
  change detection sowie ["Zoneless"](https://angular.dev/guide/zoneless) eingesetzt. Applikations-State wird über Signals gemanaged.
- Die Kommunikation mit dem Backend erfolgt über die GraphQL API unter Verwendung von [Apollo Angular](https://the-guild.dev/graphql/apollo-angular).
- Texte werden durch [Transloco](https://jsverse.gitbook.io/transloco/) übersetzt.
