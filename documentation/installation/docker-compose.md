# Docker Compose

Docker Compose kann ebenfalls genutzt werden.

[https://caddyserver.com/](https://caddyserver.com/) wird als HTTP-Server genutzt um automatisches HTTPS zu ermöglichen.

## Docker installieren

Installieren Sie zunächst Docker. Unter Linux ist die Installation von
[Docker Engine](https://docs.docker.com/engine/) ausreichend.
Alternativ installieren Sie [Docker Desktop](https://www.docker.com/products/docker-desktop/).

## Deployment durchführen

1. Kopieren Sie den Ordner `docker-deployment` auf den Server
2. Konfigurieren Sie die Anwendung in `lla.config.docker.toml` im o.g. Ordner
3. Konfigurieren Sie die Domain in `conf/Caddyfile` im o.g. Ordner
4. Starten Sie die Anwendung mit `docker compose up -d` im o.g. Ordner 

## Daten

Daten der Anwendung werden per Docker Volume wie folgt gespeichert:
- `./.docker-data/pg`: PostgreSQL Datenverzeichnis
- `./.docker-data/media`: Django Dateiuploads
- `./.docker-data/redis`: Redis Datenverzeichnis

## Docker Image bauen

Es muss das Build-Tool Werf installiert sein. Folgen Sie dafür der Anleitung unter https://werf.io/getting_started/.
Nutzen Sie den Befehl `werf build` um die Anwendung zu bauen:
`werf build --synchronization :local`.
