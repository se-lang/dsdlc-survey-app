# Konfiguration

Die Konfiguration der Anwendung erfolgt über eine [TOML](https://toml.io/) Datei.
Eine Beispieldatei ist verfügbar als `backend/lla.config-local.toml`.

## Allgemeine Einstellungen

`debug_mode`
: Aktiviert den Django `DEBUG` Modus. Sollte in Production immer `false` sein.

`development_mode`
: Aktiviert den Entwicklungsmodus, dies erlaubt z.B. Test-E-Mail Adressen

`secret_key`
: Der Django Secret Key. Muss geheim bleiben! Siehe: https://docs.djangoproject.com/en/5.2/ref/settings/#std-setting-SECRET_KEY

`network.allowed_urls`
: Eine Liste von URLs, unter der das System erreichbar ist. Dies wird für
  [CSRF-Schutz](https://docs.djangoproject.com/en/5.2/howto/csrf/) und [Validierung des `Host`-Headers](https://docs.djangoproject.com/en/5.2/ref/settings/#allowed-hosts)
  genutzt.  
  `network.frontend_url` ist implizit in dieser Liste enthalten.

`network.frontend_url`
: Die URL, unter der das Frontend erreichbar ist. Dies wird genutzt, um URLs in E-Mails zu erstellen
  (z.B. bei "Passwort vergessen").

`network.client_ip_source`
: Optional. Die Quelle für die IP-Adresse des Clients. Sh. <https://github.com/un33k/django-ipware?tab=readme-ov-file#precedence-order>
  für mögliche Werte.

`network.proxy_count`
: Optional. Die Anzahl der vorgeschalteten Proxys. Sh. <https://github.com/un33k/django-ipware?tab=readme-ov-file#proxy-count>.

`network.rate_limiting`
: Ob Rate Limiting aktiv ist, Standard `true`.

`db.dsn`
: Die Verbindung zur Datenbank, z.B. `postgres://127.0.0.1/database`. Kann optional die Datenbank, Benutzername und Passwort enthalten.
  Kann Optionen im Querystring enthalten, wie zum Beispiel `postgres://127.0.0.1?sslmode=require`.

`db.username`
: Der Benutzername für die Verbindung zur Datenbank. Optional, überschreibt den Wert aus `db.dsn`.

`db.password`
: Das Passwort für die Verbindung zur Datenbank. Optional, überschreibt den Wert aus `db.dsn`.

`db.database`
: Der Name der Datenbank. Optional, überschreibt den Wert aus `db.dsn`.

`db.extra_options`:
: Zusätzliche Django Optionen für die Datenbankverbindung, z.B. `DISABLE_SERVER_SIDE_CURSORS = true`. Sh.<https://docs.djangoproject.com/en/5.2/ref/settings/#databases>
  für die Dokumentation. 

`redis.dsn`
: Die Verbindung zum Redis-Cache, z.B. `redis://127.0.0.1/`. Kann optional die Datenbank, Benutzername und Passwort enthalten.

`redis.key_prefix`:
: Optionales Präfix für alle Werte, die in Redis gespeichert werden.

`redis.username`
: Der Benutzername für die Verbindung zu Redis. Optional, überschreibt den Wert aus `redis.dsn`.

`redis.password`
: Das Passwort für die Verbindung zu Redis. Optional, überschreibt den Wert aus `redis.dsn`.

`redis.database`
: Die Redis Datenbank. Optional, überschreibt den Wert aus `redis.dsn`.

`email.host`
: Hostname für die SMTP Verbindung, z.B. `127.0.0.1:465`.

`email.username`
: Benutzername für die SMTP Verbindung.

`email.password`
: Passwort für die SMTP Verbindung.

`email.security`
: Verschlüsselung für die SMTP Verbindung. Mögliche Werte:  
  `plaintext`: Keine Verschlüsselung  
  `implicit_tls`: Implizite TLS Verschlüsselung, häufig "SSL" genannt, meistens Port 465.  
  `explicit_tls`: Explizite TLS Verschlüsselung, häufig "STARTTLS" genannt, meistens Port 587.

`email.source_email`
: Absenderadresse, optional inkl. Name. Z.B. `email@example.com` oder `Umfragesystem <mail@example.com>`.

`storage.type`:
: Speichermodus für hochgeladene Dateien
  `local`: Dateien in einem lokalen Verzeichnis speichern. Es muss extern über HTTP bereitgestellt werden.  
  `s3`: Dateien in S3 (oder kompatibel) speichern. Verwendet django-storages, die Optionen müssen wie in der 
        [django-storages Dokumentation](https://django-storages.readthedocs.io/en/latest/backends/amazon-S3.html#settings)
        beschrieben konfiguriert werden (z.B. `storage.bucket_name`).  
  `sftp`: Dateien auf einem SFTP Server speichern. Verwendet django-storages, die Optionen müssen wie in der
          [django-storages Dokumentation](https://django-storages.readthedocs.io/en/latest/backends/sftp.html#settings)
          beschrieben konfiguriert werden (z.B. `storage.host`). Dateien müssen extern über HTTP bereitgestellt werden.

`zofar.hide_completed_questionnaires`:
: Vollständige Umfragen ausblenden. Standardmäßig `false`, optional.

`auth.activate_user_email_lifetime`:
: Sekunden oder ISO8601-Zeitspanne für die ein "Account bestätigen"-Link gültig ist.

`auth.inactive_user_lifetime`:
: Sekunden oder ISO8601-Zeitspanne nach welcher inaktive Accounts gelöscht werden.

`auth.reset_password_email_lifetime`:
: Sekunden oder ISO8601-Zeitspanne für die ein "Passwort vergessen"-Link gültig ist.

`auth.change_email_token_lifetime`:
: Sekunden oder ISO8601-Zeitspanne für die ein "E-Mail Ändern"-Link gültig ist.
