# Kubernetes

Wir empfehlen den Betrieb in Kubernetes. Das Tool "Werf" auf Basis von Helm wird für das Deployment verwendet.

## Werf installieren

Zunächst muss das Deployment-Tool Werf installiert werden. Folgen Sie dafür der Anleitung unter https://werf.io/getting_started/.
Es ist ebenfalls sinnvoll, die Kubernetes CLI `kubectl` zu installieren: https://kubernetes.io/docs/tasks/tools/

## Konfigurationsdatei erstellen

Erstellen Sie eine Datei `values.yaml` in der das Deployment konfiguriert wird.
```yaml
dependencies:
    # Bitnami Redis und PostgreSQL ebenfalls deployen
    redis: true
    postgresql: true

redis:
    architecture: standalone
    auth:
        enabled: false

api:
    secretKey: ""

ingress:
    frontendHostnames: ["dsdlc.test"]
    apiHostnames: ["api.dsdlc.test"]
```

> [!IMPORTANT]
> Generieren Sie einen neuen geheimen Schlüssel für jedes Deployment. Sie können dazu
> zum Beispiel https://djecrety.ir/ verwenden. Halten Sie diesen Schlüssel unbedingt geheim.
> 
> Tragen Sie diesen Schlüssel unter `api.secretKey` ein.

## Deployment durchführen

> [!NOTE]
> Stellen Sie sicher, dass das korrekte Kubernetes Cluster konfiguriert ist, z.B. über `kubectl config current-context`.

Führen Sie den folgenden Befehl aus, um DSDLC zu deployen oder zu aktualisieren:
```shell
werf bundle apply --tag $VERSION --release $RELEASE_NAME --namespace $NAMESPACE --repo docker.io/libfi/dsdlc --values values.yaml
```

- Ersetzen Sie `$VERSION` durch die gewünschte DSDLC-Version.
- Ersetzen Sie `$RELEASE_NAME` durch einen Namen für das Deployment, z.B. `dsdlc-production`
- Ersetzen die `$NAMESPACE` durch den gewünschten Kubernetes Namespace für das Deployment.

Warten Sie auf die Fertigstellung des Deployments, Werf zeigt fortlaufend den Status an während die Anwendung startet.

## Konfigurationsmöglichkeiten

Folgende Konfigurationsmöglichkeiten gibt es über Werf-Values (`values.yaml`):
```yaml
fullnameOverride: ""  # Vollen Namen (Release + Name) überschreiben
nameOverride: ""      # Namen (ohne Release) überschreiben

applicationConfig: {} # Zusätzliche Anwendungskonfiguration für lla.config.yaml (s.u.)

dependencies:
    redis: true        # Automatisch bitnami/redis mit installieren und verwenden
    postgresql: true   # Automatisch bitnami/postgresql mit installieren und verwenden

# Datenbankserver (PostgreSQL) konfigurieren, nur erforderlich, falls der Server nicht durch dieses Chart verwaltet wird (s.o.)
databaseConnection:
    host: ""
    username: ""
    password: ""
    databaseName: ""
    port: 5432
    disableServerSideCursors: false
    sslmode: "prefer"

# Redis Cache-Server konfigurieren, nur erforderlich, falls Redis nicht durch dieses Chart verwaltet wird (s.o.)
redisConnection:
    host: ""
    port: 6379
    database: ""
    username: ""
    password: ""
    keyPrefix: ""

# HTTP-Ingress konfigurieren
ingress:
    name: "ing"
    apiHostnames: [""]
    frontendHostnames: [""]
    className: "nginx"
    annotations: {}
    tls:
        enabled: false
        secretName: "tls"

# PostgreSQL Datenbankverbindung konfigurieren, nur erforderlich, falls PG nicht durch dieses Chart verwaltet wird (s.o.)
postgresql:
    auth:
        username: dslc
        database: dslc
        password: dslc

reverseProxy:
    name: "nginx"

api:
    secretKey: ""  # Hinweis oben beachten
    name: "api"
    migrationJobName: "migrate"

pushNotifications:
    privateKey: ""

worker:
    name: "worker"

configMap:
    name: "config"

secrets:
    name: "secret"
    nameFile: "secret-files"

infra:
    replicas: 1
    celeryReplicas: 1
    wsgiWorkers: 2

tolerations: [ ]
nodeSelector: { }
imagePullSecrets: [ ]

podDisruptionBudget:
    api:
        minAvailable: ""
        maxUnavailable: ""
    reverseProxy:
        minAvailable: ""
        maxUnavailable: ""

email:
    host: ""
    username: ""
    password: ""
    security: ""
    source_email: ""
```
