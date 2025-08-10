"""
Gunicorn configuration for FinWise Backend
"""
import multiprocessing
import os

# Server socket
bind = os.environ.get('GUNICORN_BIND', '0.0.0.0:8000')
backlog = 2048

# Worker processes
workers = os.environ.get('GUNICORN_WORKERS', multiprocessing.cpu_count() * 2 + 1)
worker_class = 'sync'
worker_connections = 1000
max_requests = 1000
max_requests_jitter = 50
preload_app = True

# Timeout settings
timeout = 30
keepalive = 2
graceful_timeout = 30

# Logging
accesslog = '-'
errorlog = '-'
loglevel = 'info'
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'

# Process naming
proc_name = 'finwise_backend'

# Security
limit_request_line = 4094
limit_request_fields = 100
limit_request_field_size = 8190

# Performance
# worker_tmp_dir = '/dev/shm'  # Use RAM for temporary files (Linux only)
# Use system temp directory for macOS compatibility
worker_tmp_dir = None
preload_app = True
reload = False

# Environment
raw_env = [
    'DJANGO_SETTINGS_MODULE=finwise_backend.settings_production',
] 