# Web Push Konfiguration

1. Zunächst ein KeyPair generieren:

    ```shell
    openssl ecparam -genkey -name prime256v1 | openssl ec -out vapid_keypair.pem
    ```

2. Den Private-Key für den Server extrahieren und Base64 encodieren:
    ```shell
    openssl ec -in vapid_keypair.pem -outform DER | base64 -w0
    ```

3. Den Public-Key für den Client extrahieren und Base64 zu encodieren:
    ```shell
    openssl ec -in vapid_keypair.pem -pubout -outform DER|tail -c 65 | base64 -w0
    ```

4. Den base64-encodierten Public Key unter `frontend/src/environments/environment.production.ts`
   in `webPushKey` eintragen.

5. Den Private-Key Django zur Verfügung stellen. Dafür die `DJANGO_WP_PRIVATE_KEY` auf den 
   base64-encodierten Private-Key setzen. Wichtig: Diese Variable muss für Django und den
   Celery-Worker gesetzt sein.
