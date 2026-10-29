#!/bin/bash
openssl req -x509 -newkey rsa:4096 -keyout selfsigned_key.pem -out selfsigned_cert.pem -sha256 -days 3650 -nodes -subj "/C=XX/ST=Niedersachsen/L=Bad Zwischenahn/O=CodePartner/CN=django"
echo "E2E_SELFSIGNED_KEY"
