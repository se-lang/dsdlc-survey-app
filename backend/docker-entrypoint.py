#!/usr/bin/env python3
import argparse
import os
import sys
from enum import StrEnum

from django.core.management import execute_from_command_line
from gunicorn.app.wsgiapp import run as run_gunicorn
from celery.__main__ import main as celery_main


class Action(StrEnum):
    START = 'start'
    START_CELERY = 'start_celery'
    START_CELERY_BEAT = 'start_celery_beat'
    MIGRATE = 'migrate'
    MIGRATE_THEN_START = 'migrate_then_start'


def main():
    parser = argparse.ArgumentParser(description='Docker entrypoint')
    parser.add_argument(
        'action', choices=list(Action), type=Action, default=Action.START, nargs='?'
    )
    opts = parser.parse_args()

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lebenslaeufe_app.settings')

    match opts.action:
        case Action.START:
            sys.argv[1:] = []
            run_gunicorn()
        case Action.START_CELERY:
            sys.argv[1:] = [
                '-A',
                'lebenslaeufe_app',
                'worker',
                '-l',
                'INFO',
                '-P',
                'solo',
            ]
            celery_main()
        case Action.START_CELERY_BEAT:
            sys.argv[1:] = ['-A', 'lebenslaeufe_app', 'beat', '-l', 'INFO']
            celery_main()
        case Action.MIGRATE:
            sys.argv[1:] = ['migrate']
            execute_from_command_line()
        case Action.MIGRATE_THEN_START:
            sys.argv[1:] = ['migrate']
            execute_from_command_line()

            sys.argv[1:] = []
            run_gunicorn()
        case _:
            raise AssertionError()


if __name__ == '__main__':
    main()
