---
redirect_from:
  - /docs/deployment/
  - /en/docs/deployment/
  - /en/deployment/
layout: docs
title: Deploy
permalink: /pt/docs/deployment/
lang: pt
---

Este guia cobre o deploy de aplicações PivotPHP 4.0 em produção (PHP-FPM + Nginx/Apache ou
containers).

## Requisitos do servidor

- **PHP 8.1** ou superior com **ext-json** e **ext-mbstring**
- **Composer** 2.x
- Servidor web (Nginx ou Apache) com PHP-FPM
- Banco de dados (se aplicável): MySQL/MariaDB, PostgreSQL ou SQLite

## Otimização

O framework não tem uma CLI de cache (`config:cache`, `route:cache`). A otimização relevante é o
autoloader do Composer:

```bash
composer install --optimize-autoloader --no-dev
```

## Configuração do servidor web

### Nginx

Aponte o document root para `public/` e encaminhe tudo que não for arquivo para `index.php`:

```nginx
server {
    listen 80;
    server_name exemplo.com;
    root /var/www/exemplo/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* { deny all; }
}
```

### Apache

```apache
<VirtualHost *:80>
    ServerName exemplo.com
    DocumentRoot /var/www/exemplo/public

    <Directory /var/www/exemplo/public>
        AllowOverride All
        Require all granted
        Options -MultiViews -Indexes

        RewriteEngine On
        RewriteCond %{HTTP:Authorization} .
        RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^ index.php [L]
    </Directory>
</VirtualHost>
```

> Os cabeçalhos de segurança (HSTS, CSP, `X-Frame-Options`, etc.) podem ser enviados pelo
> `SecurityHeadersMiddleware` do `pivotphp/security` em vez de duplicá-los no servidor. Veja
> [Segurança]({{ '/pt/docs/security/' | relative_url }}).

## Configuração de ambiente

`.env` na raiz (nunca versionado):

```bash
APP_NAME="Minha API"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://exemplo.com

DB_DRIVER=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=production_db
DB_USERNAME=db_user
DB_PASSWORD=senha_segura
```

Proteja o arquivo e garanta que ele não entre no Git:

```bash
chmod 600 .env
echo ".env" >> .gitignore
```

> **`APP_DEBUG=false` em produção.** Com debug ligado, respostas de erro expõem mensagem, arquivo,
> linha e traceback.

## Schema e migrações

O core não traz CLI de migrações. Use o `Database` para rodar SQL de schema/seed (ele aceita vários
statements via `exec()`):

```php
use PivotPHP\Core\Database\Database;

$db = new Database([/* config */]);
$db->exec(file_get_contents(__DIR__ . '/database/schema.sql'));
```

Para migrações versionadas, use uma biblioteca de migração de sua preferência ou uma ferramenta de
ORM independente (o `pivotphp/cycle-orm` está [pausado]({{ '/pt/docs/extensions/cycle-orm/' | relative_url }})).

## Deploy sem downtime (release + symlink)

```bash
#!/bin/bash
set -e

APP_DIR="/var/www/exemplo"
RELEASE="${APP_DIR}/releases/$(date +%Y%m%d%H%M%S)"
SHARED="${APP_DIR}/shared"

mkdir -p "$RELEASE"
git clone --depth 1 https://github.com/seurepositorio/suaapp.git "$RELEASE"

cd "$RELEASE"
composer install --optimize-autoloader --no-dev

ln -nfs "${SHARED}/.env" .env

ln -nfs "$RELEASE" "${APP_DIR}/current"

sudo service php8.1-fpm reload

cd "${APP_DIR}/releases" && ls -t | tail -n +6 | xargs -r rm -rf

echo "Deploy concluído."
```

## Containers

```dockerfile
FROM php:8.1-fpm-alpine

RUN docker-php-ext-install pdo_mysql mbstring

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www
COPY . /var/www
RUN composer install --optimize-autoloader --no-dev

RUN chown -R www-data:www-data /var/www
USER www-data

EXPOSE 9000
CMD ["php-fpm"]
```

Aponte o Nginx (container ou host) para o FPM na porta 9000.

## Monitoramento

### Endpoint de saúde

```php
$app->get('/health', fn ($req, $res) => $res->json([
    'status' => 'healthy',
    'timestamp' => gmdate('c'),
]));
```

### Logging

O core usa o logger PSR-3 `PivotPHP\Core\Logging\PsrLogger`:

```php
use PivotPHP\Core\Logging\PsrLogger;

$logger = new PsrLogger(__DIR__ . '/logs/app.log');
$logger->info('Deploy concluído');
$logger->error('Falha ao processar', ['contexto' => '...']);
```

## Otimização de performance

### OPcache

```ini
opcache.enable=1
opcache.memory_consumption=256
opcache.interned_strings_buffer=16
opcache.max_accelerated_files=10000
opcache.validate_timestamps=0
```

### PHP-FPM

```ini
pm = dynamic
pm.max_children = 32
pm.start_servers = 5
pm.min_spare_servers = 5
pm.max_spare_servers = 25
pm.max_requests = 500
```

## Checklist de deploy

- [ ] `APP_DEBUG=false`
- [ ] `.env` com permissões restritas e fora do Git
- [ ] HTTPS com certificado válido
- [ ] `composer install --optimize-autoloader --no-dev`
- [ ] OPcache habilitado
- [ ] Health check configurado
- [ ] Rotação de logs
- [ ] Middlewares de segurança (`pivotphp/security`) ativos
- [ ] Rate limiting com storage compartilhado (se usado)
