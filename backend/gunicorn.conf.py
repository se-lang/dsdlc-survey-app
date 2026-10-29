import os

capture_output = True
enable_stdio_inheritance = True
wsgi_app = 'lebenslaeufe_app.wsgi'

bind = os.getenv('GUNICORN_BIND', '0.0.0.0:8000')
workers = int(os.getenv('GUNICORN_WORKERS', 1))
threads = int(os.getenv('GUNICORN_THREADS', 1))
worker_class = 'sync' if threads == 1 else 'gthread'
