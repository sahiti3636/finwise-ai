#!/usr/bin/env python3
"""
Production management script for FinWise Backend
"""
import os
import sys
import django
import subprocess
from pathlib import Path

def setup_environment():
    """Setup Django environment for production"""
    # Add the project root to Python path
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    # Set Django settings
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'finwise_backend.settings_production')
    django.setup()

def collect_static():
    """Collect static files for production"""
    print("📁 Collecting static files...")
    try:
        from django.core.management import execute_from_command_line
        execute_from_command_line(['manage.py', 'collectstatic', '--noinput'])
        print("✅ Static files collected successfully")
    except Exception as e:
        print(f"❌ Error collecting static files: {e}")

def run_migrations():
    """Run database migrations"""
    print("🔄 Running database migrations...")
    try:
        from django.core.management import execute_from_command_line
        execute_from_command_line(['manage.py', 'migrate'])
        print("✅ Migrations completed successfully")
    except Exception as e:
        print(f"❌ Error running migrations: {e}")

def check_health():
    """Check application health"""
    print("🏥 Checking application health...")
    try:
        from django.core.management import execute_from_command_line
        execute_from_command_line(['manage.py', 'check', '--deploy'])
        print("✅ Health check passed")
    except Exception as e:
        print(f"❌ Health check failed: {e}")

def create_superuser():
    """Create a superuser account"""
    print("👤 Creating superuser account...")
    try:
        from django.core.management import execute_from_command_line
        execute_from_command_line(['manage.py', 'createsuperuser'])
        print("✅ Superuser created successfully")
    except Exception as e:
        print(f"❌ Error creating superuser: {e}")

def start_gunicorn():
    """Start Gunicorn server"""
    print("🚀 Starting Gunicorn server...")
    try:
        subprocess.run([
            'gunicorn',
            '--config', 'gunicorn.conf.py',
            'finwise_backend.wsgi_production:application'
        ], check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Error starting Gunicorn: {e}")
    except FileNotFoundError:
        print("❌ Gunicorn not found. Install with: pip install gunicorn")

def main():
    """Main function"""
    print("🏗️  FinWise Production Management")
    print("=" * 40)
    
    if len(sys.argv) < 2:
        print("Usage: python manage_production.py [command]")
        print("\nAvailable commands:")
        print("  collect-static  - Collect static files")
        print("  migrate        - Run database migrations")
        print("  health-check   - Check application health")
        print("  superuser      - Create superuser account")
        print("  start          - Start Gunicorn server")
        print("  deploy         - Full deployment (collect static + migrate + health check)")
        return
    
    command = sys.argv[1]
    
    if command == 'collect-static':
        setup_environment()
        collect_static()
    elif command == 'migrate':
        setup_environment()
        run_migrations()
    elif command == 'health-check':
        setup_environment()
        check_health()
    elif command == 'superuser':
        setup_environment()
        create_superuser()
    elif command == 'start':
        setup_environment()
        start_gunicorn()
    elif command == 'deploy':
        setup_environment()
        collect_static()
        run_migrations()
        check_health()
        print("\n🎉 Deployment completed successfully!")
    else:
        print(f"❌ Unknown command: {command}")

if __name__ == "__main__":
    main() 