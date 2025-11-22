SELECT 'CREATE DATABASE blync'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'blync')\gexec