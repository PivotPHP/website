---
layout: docs
title: Deployment
permalink: /docs/deployment/
---

This guide covers deployment procedures for PivotPHP v1.1.4 applications with performance optimizations and extension support.

<div style="background: rgba(124, 58, 237, 0.1); border-left: 4px solid rgba(124, 58, 237, 0.8); padding: 1rem; margin: 1rem 0; border-radius: 4px;">
  <strong>🚀 PivotPHP v1.1.4 Production Deployment</strong><br>
  Revolutionary performance with 84,998 ops/sec peak performance. ReactPHP extension achieves 19,707 req/sec (market leader) for high-performance production deployments.
</div>

## Performance Deployment Options

### 🔥 **ReactPHP Extension** (Recommended for High Performance)
- **Performance**: 19,707 req/sec (market leader)
- **Use Case**: WebSocket apps, real-time features, high-concurrency
- **Deployment**: Continuous runtime with Supervisor

### 💫 **Core Framework** (Traditional HTTP)
- **Performance**: 6,227 req/sec (Docker validated)
- **Use Case**: REST APIs, microservices, serverless functions
- **Deployment**: Standard web server (Nginx/Apache)

### 🎯 **Cycle ORM Extension** (Database-Heavy Apps)
- **Performance**: 457,870 ops/sec (database operations)
- **Use Case**: Database-driven applications
- **Deployment**: Zero-configuration database setup

## Server Requirements

Before deploying PivotPHP v1.1.4, ensure your server meets these requirements:

### Core Requirements
- **PHP 8.1** or higher (8.4+ recommended for array callable syntax)
- **Composer** 2.0 or higher
- **Web Server**: Nginx or Apache (for Core) or Supervisor (for ReactPHP)
- **Database**: MySQL 5.7+, PostgreSQL 10+, or SQLite 3.8.8+
- **Memory**: 512MB minimum (1GB+ recommended for ReactPHP)
- **CPU**: 2+ cores recommended for high-performance deployments

### PHP Extensions
- **Required**: BCMath, Ctype, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML
- **ReactPHP**: pcntl, posix, sockets (for async operations)
- **Performance**: OPcache, JIT (for optimal performance)

### Performance Recommendations
- **OPcache**: Enable with `opcache.enable=1`
- **JIT**: Enable with `opcache.jit=1255`
- **Memory**: `memory_limit=512M` (1GB+ for ReactPHP)
- **Execution Time**: `max_execution_time=300` (unlimited for ReactPHP)

## Optimization

### Composer Optimization

```bash
# Install dependencies without dev packages
composer install --optimize-autoloader --no-dev

# Or if already installed
composer dump-autoload --optimize --no-dev
```

### Configuration Caching

Cache your configuration files for better performance:

```bash
# Cache configuration
php bin/console config:cache

# Clear configuration cache
php bin/console config:clear
```

### Route Caching

Cache your routes for faster route resolution:

```bash
# Cache routes
php bin/console route:cache

# Clear route cache
php bin/console route:clear
```

### View Caching

If using a template engine:

```bash
# Cache views
php bin/console view:cache

# Clear view cache
php bin/console view:clear
```

## Web Server Configuration

### Nginx Configuration

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;
    root /var/www/example.com/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip compression
    gzip on;
    gzip_comp_level 5;
    gzip_min_length 256;
    gzip_types application/json application/javascript text/css text/plain;
}

# SSL Configuration
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name example.com www.example.com;
    root /var/www/example.com/public;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # ... rest of configuration same as above
}
```

### Apache Configuration

```apache
<VirtualHost *:80>
    ServerName example.com
    ServerAlias www.example.com
    DocumentRoot /var/www/example.com/public

    <Directory /var/www/example.com/public>
        AllowOverride All
        Require all granted

        # Enable .htaccess
        Options -MultiViews -Indexes

        RewriteEngine On

        # Handle Authorization Header
        RewriteCond %{HTTP:Authorization} .
        RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

        # Redirect Trailing Slashes If Not A Folder...
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteCond %{REQUEST_URI} (.+)/$
        RewriteRule ^ %1 [L,R=301]

        # Send Requests To Front Controller...
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^ index.php [L]
    </Directory>

    # Security Headers
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"

    ErrorLog ${APACHE_LOG_DIR}/example.com-error.log
    CustomLog ${APACHE_LOG_DIR}/example.com-access.log combined
</VirtualHost>
```

## Environment Configuration

### Production .env File

```bash
APP_NAME="My Application"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://example.com

# Security
APP_KEY=base64:your-secure-random-key-here

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=production_db
DB_USERNAME=db_user
DB_PASSWORD=secure_password

# Cache
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_DRIVER=redis

# Redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Mail
MAIL_DRIVER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@example.com
MAIL_FROM_NAME="${APP_NAME}"

# Logging
LOG_CHANNEL=daily
LOG_LEVEL=error

# External Services
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_APP_CLUSTER=mt1
```

### Securing Environment Variables

```bash
# Set proper permissions
chmod 600 .env

# Ensure .env is in .gitignore
echo ".env" >> .gitignore

# Use environment variables from server
# In Apache
SetEnv APP_KEY "your-key"

# In Nginx (in PHP-FPM pool config)
env[APP_KEY] = "your-key"
```

## Database Deployment

### Running Migrations

```bash
# Run migrations
php bin/console migrate --force

# With seeding (be careful in production!)
php bin/console migrate --seed --force

# Rollback if needed
php bin/console migrate:rollback --force
```

### Database Optimization

```sql
-- MySQL optimization example
ALTER TABLE users ADD INDEX idx_email (email);
ALTER TABLE posts ADD INDEX idx_user_created (user_id, created_at);
ALTER TABLE sessions ADD INDEX idx_user_id (user_id);

-- Analyze tables
ANALYZE TABLE users, posts, comments;

-- Optimize tables
OPTIMIZE TABLE users, posts, comments;
```

## Zero-Downtime Deployment

### Deployment Script

```bash
#!/bin/bash

# Configuration
APP_DIR="/var/www/example.com"
NEW_RELEASE_DIR="${APP_DIR}/releases/$(date +%Y%m%d%H%M%S)"
SHARED_DIR="${APP_DIR}/shared"
CURRENT_DIR="${APP_DIR}/current"

# Create new release directory
mkdir -p $NEW_RELEASE_DIR

# Pull latest code
cd $NEW_RELEASE_DIR
git clone https://github.com/yourrepo/yourapp.git .

# Install dependencies
composer install --optimize-autoloader --no-dev

# Copy environment file
cp ${SHARED_DIR}/.env .env

# Link shared directories
ln -nfs ${SHARED_DIR}/storage storage
ln -nfs ${SHARED_DIR}/public/uploads public/uploads

# Run deployment commands
php bin/console migrate --force
php bin/console config:cache
php bin/console route:cache
php bin/console view:cache

# Warm up cache
php bin/console cache:warmup

# Switch symlink atomically
ln -nfs $NEW_RELEASE_DIR $CURRENT_DIR

# Reload PHP-FPM
sudo service php8.1-fpm reload

# Clean up old releases (keep last 5)
cd ${APP_DIR}/releases && ls -t | tail -n +6 | xargs rm -rf

echo "Deployment completed successfully!"
```

### Using Envoy

```php
// Envoy.blade.php
@servers(['web' => 'user@example.com'])

@setup
    $repository = 'git@github.com:yourrepo/yourapp.git';
    $releases_dir = '/var/www/example.com/releases';
    $app_dir = '/var/www/example.com';
    $release = date('YmdHis');
    $new_release_dir = $releases_dir .'/'. $release;
@endsetup

@task('deploy')
    echo 'Cloning repository'
    [ -d {% raw %}{{ $releases_dir }}{% endraw %} ] || mkdir {% raw %}{{ $releases_dir }}{% endraw %}
    git clone --depth 1 --branch master {% raw %}{{ $repository }}{% endraw %} {% raw %}{{ $new_release_dir }}{% endraw %}

    echo 'Installing composer dependencies'
    cd {% raw %}{{ $new_release_dir }}{% endraw %}
    composer install --prefer-dist --no-dev --optimize-autoloader

    echo 'Linking .env file'
    ln -nfs {% raw %}{{ $app_dir }}{% endraw %}/.env {% raw %}{{ $new_release_dir }}{% endraw %}/.env

    echo 'Linking storage directory'
    ln -nfs {% raw %}{{ $app_dir }}{% endraw %}/storage {% raw %}{{ $new_release_dir }}{% endraw %}/storage

    echo 'Running migrations'
    cd {% raw %}{{ $new_release_dir }}{% endraw %}
    php bin/console migrate --force

    echo 'Caching configuration'
    php bin/console config:cache
    php bin/console route:cache

    echo 'Linking current release'
    ln -nfs {% raw %}{{ $new_release_dir }}{% endraw %} {% raw %}{{ $app_dir }}{% endraw %}/current

    echo 'Restarting FPM'
    sudo service php8.1-fpm reload
@endtask
```

Run deployment:

```bash
envoy run deploy
```

## Container Deployment

### Dockerfile

```dockerfile
FROM php:8.1-fpm-alpine

# Install dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    zip \
    unzip \
    nginx \
    supervisor

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy application files
COPY . /var/www

# Install application dependencies
RUN composer install --optimize-autoloader --no-dev

# Copy configuration files
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/php/php.ini /usr/local/etc/php/conf.d/app.ini
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Set permissions
RUN chown -R www-data:www-data /var/www

# Expose port
EXPOSE 80

# Start services
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    image: pivotphp-app
    container_name: pivotphp-app
    restart: unless-stopped
    working_dir: /var/www
    volumes:
      - ./:/var/www
      - ./docker/php/php.ini:/usr/local/etc/php/conf.d/app.ini
    networks:
      - pivotphp

  nginx:
    image: nginx:alpine
    container_name: pivotphp-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./:/var/www
      - ./docker/nginx:/etc/nginx/conf.d
    networks:
      - pivotphp

  mysql:
    image: mysql:8.0
    container_name: pivotphp-mysql
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: pivotphp
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_PASSWORD: secret
      MYSQL_USER: pivotphp
    volumes:
      - dbdata:/var/lib/mysql
    networks:
      - pivotphp

  redis:
    image: redis:alpine
    container_name: pivotphp-redis
    restart: unless-stopped
    networks:
      - pivotphp

networks:
  pivotphp:
    driver: bridge

volumes:
  dbdata:
    driver: local
```

## Monitoring

### Health Check Endpoint

```php
// routes/web.php
$app->get('/health', function() {
    $checks = [
        'database' => $this->checkDatabase(),
        'cache' => $this->checkCache(),
        'queue' => $this->checkQueue(),
        'storage' => $this->checkStorage(),
    ];

    $healthy = !in_array(false, $checks);

    return response()->json([
        'status' => $healthy ? 'healthy' : 'unhealthy',
        'checks' => $checks,
        'timestamp' => now()->toIso8601String(),
    ], $healthy ? 200 : 503);
});
```

### Logging

Configure proper logging for production:

```php
// config/logging.php
'channels' => [
    'daily' => [
        'driver' => 'daily',
        'path' => storage_path('logs/helix.log'),
        'level' => env('LOG_LEVEL', 'error'),
        'days' => 14,
    ],

    'slack' => [
        'driver' => 'slack',
        'url' => env('LOG_SLACK_WEBHOOK_URL'),
        'username' => 'PivotPHP Log',
        'emoji' => ':boom:',
        'level' => 'critical',
    ],

    'papertrail' => [
        'driver' => 'monolog',
        'level' => 'debug',
        'handler' => SyslogUdpHandler::class,
        'handler_with' => [
            'host' => env('PAPERTRAIL_URL'),
            'port' => env('PAPERTRAIL_PORT'),
        ],
    ],
],
```

## Performance Optimization

### OPcache Configuration

```ini
; php.ini
opcache.enable=1
opcache.enable_cli=1
opcache.memory_consumption=256
opcache.interned_strings_buffer=16
opcache.max_accelerated_files=10000
opcache.validate_timestamps=0
opcache.revalidate_freq=0
opcache.save_comments=0
```

### PHP-FPM Tuning

```ini
; /etc/php/8.1/fpm/pool.d/www.conf
pm = dynamic
pm.max_children = 50
pm.start_servers = 5
pm.min_spare_servers = 5
pm.max_spare_servers = 35
pm.max_requests = 500
```

## Security Checklist

- [ ] Disable debug mode (`APP_DEBUG=false`)
- [ ] Set secure APP_KEY
- [ ] Configure HTTPS with valid SSL certificate
- [ ] Set proper file permissions (755 for directories, 644 for files)
- [ ] Disable directory listing
- [ ] Configure firewall rules
- [ ] Set up fail2ban for brute force protection
- [ ] Regular security updates
- [ ] Configure backup strategy
- [ ] Monitor logs for suspicious activity
- [ ] Use strong database passwords
- [ ] Restrict database access to localhost only
- [ ] Enable query logging for auditing
- [ ] Configure rate limiting
- [ ] Set up monitoring and alerting
