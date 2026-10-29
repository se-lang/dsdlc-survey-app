ARG DJANGO_IMAGE=django
ARG FRONTEND_IMAGE=frontend-builder
ARG UNAME=app
ARG UID=1000
ARG GID=1000
ARG ANGULAR_ENV=production

FROM node:24-bookworm AS frontend-builder
ARG UNAME
ARG UID
ARG GID
ARG ANGULAR_ENV
RUN groupadd -g $GID -o $UNAME
RUN useradd -m -u $UID -g $GID -o -s /bin/bash $UNAME
USER $UNAME
RUN mkdir /home/$UNAME/code
WORKDIR /home/$UNAME/code
COPY --chown=$UID:$GID package.json package.json
COPY --chown=$UID:$GID package-lock.json package-lock.json
RUN npm ci
COPY --chown=1000:1000 angular.json angular.json
COPY --chown=1000:1000 frontend frontend
COPY --chown=1000:1000 scripts scripts
RUN npm run build -- --configuration=$ANGULAR_ENV && npm run precompress

FROM python:3.13-bookworm AS django
ARG DJANGO_IMAGE
ARG FRONTEND_IMAGE
ARG UNAME
ARG GID
ARG UID
ENV PYTHONUNBUFFERED=1
ENV POETRY_HOME=/opt/poetry
RUN python3 -m venv $POETRY_HOME
RUN $POETRY_HOME/bin/pip install 'poetry>=2.0.0,<2.1.0'
RUN groupadd -g $GID -o $UNAME
RUN useradd -m -u $UID -g $GID -o -s /bin/bash $UNAME
USER $UNAME
RUN mkdir /home/$UNAME/code
WORKDIR /home/$UNAME/code
COPY pyproject.toml poetry.lock /home/$UNAME/code/
RUN $POETRY_HOME/bin/poetry install
COPY --chown=$UID:$GID backend /home/$UNAME/code/backend
WORKDIR /home/$UNAME/code/backend
RUN /opt/poetry/bin/poetry run python manage.py collectstatic
ENTRYPOINT ["/opt/poetry/bin/poetry", "run", "python", "docker-entrypoint.py"]
CMD []
EXPOSE 8000

FROM ${DJANGO_IMAGE} AS django-source
FROM ${FRONTEND_IMAGE} AS frontend-builder-source

FROM alpine:3 AS nginx-base
RUN apk update && apk add nginx nginx-mod-http-brotli nginx-mod-http-zstd

FROM nginx-base AS nginx
ARG DJANGO_IMAGE
ARG FRONTEND_IMAGE
ARG UNAME
ARG UID
ARG GID
COPY nginx-static.conf /etc/nginx/http.d/default.conf
COPY --from=frontend-builder-source /home/$UNAME/code/frontend/dist/lebenslaeufe-app/browser /usr/share/nginx/html/
COPY --from=frontend-builder-source /home/$UNAME/code/frontend/dist/lebenslaeufe-app/3rdpartylicenses.txt /usr/share/nginx/html/3rdpartylicenses.txt
COPY --from=django-source /home/$UNAME/code/backend/static /usr/share/nginx/html/static
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
