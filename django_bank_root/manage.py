#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_bank_root.settings')

    # Explicitly load .env from the same directory as manage.py
    try:
        import dotenv
    except ImportError:
        # Handle the case where dotenv might not be installed during some initial setups
        pass 
    else:
        # Attempt to find .env in the same directory as manage.py
        # BASE_DIR for manage.py is the directory it resides in.
        dotenv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
        if os.path.exists(dotenv_path):
            dotenv.load_dotenv(dotenv_path)
        else:
            # Fallback if .env is not found, though it should be there.
            # This could be a print statement for debugging if needed.
            print(f"Warning: .env file not found at {dotenv_path}") # Added a warning

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
