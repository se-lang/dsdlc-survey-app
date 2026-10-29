#!/usr/bin/env python
import os
import sys
from pathlib import Path


def main():
    from backend.manage import main as real_main

    root_dir = Path(__file__).parent
    target_dir = root_dir / 'backend'
    sys.path.insert(0, str(target_dir))
    os.chdir(target_dir)

    real_main()


if __name__ == '__main__':
    main()
