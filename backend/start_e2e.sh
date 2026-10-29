#!/bin/sh
/opt/poetry/bin/poetry run python manage.py migrate
/opt/poetry/bin/poetry run python manage.py loaddata e2e_data
/opt/poetry/bin/poetry run gunicorn --capture-output --enable-stdio-inheritance -w 1 -b 0.0.0.0:8000 lebenslaeufe_app.wsgi
