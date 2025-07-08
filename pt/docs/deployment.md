---
layout: docs
title: Deploy
permalink: /pt/docs/deployment/
lang: pt
---

Este guia cobre as melhores práticas e procedimentos para fazer deploy de aplicações PivotPHP em ambientes de produção.

## Requisitos do Servidor

Antes de fazer o deploy, certifique-se de que seu servidor atende a estes requisitos:

- **PHP 8.1** ou superior
- **Composer** 2.0 ou superior
- **Servidor Web**: Nginx ou Apache
- **Banco de Dados**: MySQL 5.7+, PostgreSQL 10+, ou SQLite 3.8.8+
- **Extensões PHP**:
  - BCMath
  - Ctype
  - JSON
  - Mbstring
  - OpenSSL
  - PDO
  - Tokenizer
  - XML

## Otimização

### Otimização do Composer

```bash
# Instalar dependências sem pacotes de desenvolvimento
composer install --optimize-autoloader --no-dev

# Ou se já estiver instalado
composer dump-autoload --optimize --no-dev
```

### Cache de Configuração

Cache seus arquivos de configuração para melhor performance:

```bash
# Cachear configuração
php helix config:cache

# Limpar cache de configuração
php helix config:clear
```

### Cache de Rotas

Cache suas rotas para resolução mais rápida:

```bash
# Cachear rotas
php helix route:cache

# Limpar cache de rotas
php helix route:clear
```

### Cache de Views

Se estiver usando um motor de templates:

```bash
# Cachear views
php helix view:cache

# Limpar cache de views
php helix view:clear
```

## Configuração do Servidor Web

### Configuração do Nginx

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name exemplo.com www.exemplo.com;
    root /var/www/exemplo.com/public;

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

    # Cabeçalhos de segurança
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Compressão Gzip
    gzip on;
    gzip_comp_level 5;
    gzip_min_length 256;
    gzip_types application/json application/javascript text/css text/plain;
}

# Configuração SSL
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name exemplo.com www.exemplo.com;
    root /var/www/exemplo.com/public;

    ssl_certificate /etc/letsencrypt/live/exemplo.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/exemplo.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # ... resto da configuração igual ao acima
}
```

### Configuração do Apache

```apache
<VirtualHost *:80>
    ServerName exemplo.com
    ServerAlias www.exemplo.com
    DocumentRoot /var/www/exemplo.com/public

    <Directory /var/www/exemplo.com/public>
        AllowOverride All
        Require all granted

        # Habilitar .htaccess
        Options -MultiViews -Indexes

        RewriteEngine On

        # Lidar com cabeçalho de autorização
        RewriteCond %{HTTP:Authorization} .
        RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

        # Redirecionar barras finais se não for uma pasta...
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteCond %{REQUEST_URI} (.+)/$
        RewriteRule ^ %1 [L,R=301]

        # Enviar requisições para o controlador frontal...
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^ index.php [L]
    </Directory>

    # Cabeçalhos de segurança
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"

    ErrorLog ${APACHE_LOG_DIR}/exemplo.com-error.log
    CustomLog ${APACHE_LOG_DIR}/exemplo.com-access.log combined
</VirtualHost>
```

## Configuração do Ambiente

### Arquivo .env de Produção

```bash
APP_NAME="Minha Aplicação"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://exemplo.com

# Segurança
APP_KEY=base64:sua-chave-aleatoria-segura-aqui

# Banco de Dados
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=production_db
DB_USERNAME=db_user
DB_PASSWORD=senha_segura

# Cache
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_DRIVER=redis

# Redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Email
MAIL_DRIVER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=seu-usuario
MAIL_PASSWORD=sua-senha
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@exemplo.com
MAIL_FROM_NAME="${APP_NAME}"

# Logging
LOG_CHANNEL=daily
LOG_LEVEL=error

# Serviços Externos
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_APP_CLUSTER=mt1
```

### Protegendo Variáveis de Ambiente

```bash
# Definir permissões adequadas
chmod 600 .env

# Garantir que .env esteja no .gitignore
echo ".env" >> .gitignore

# Usar variáveis de ambiente do servidor
# No Apache
SetEnv APP_KEY "sua-chave"

# No Nginx (na configuração do pool PHP-FPM)
env[APP_KEY] = "sua-chave"
```

## Deploy do Banco de Dados

### Executando Migrações

```bash
# Executar migrações
php helix migrate --force

# Com seeding (cuidado em produção!)
php helix migrate --seed --force

# Rollback se necessário
php helix migrate:rollback --force
```

### Otimização do Banco de Dados

```sql
-- Exemplo de otimização MySQL
ALTER TABLE users ADD INDEX idx_email (email);
ALTER TABLE posts ADD INDEX idx_user_created (user_id, created_at);
ALTER TABLE sessions ADD INDEX idx_user_id (user_id);

-- Analisar tabelas
ANALYZE TABLE users, posts, comments;

-- Otimizar tabelas
OPTIMIZE TABLE users, posts, comments;
```

## Deploy Sem Downtime

### Script de Deploy

```bash
#!/bin/bash

# Configuração
APP_DIR="/var/www/exemplo.com"
NEW_RELEASE_DIR="${APP_DIR}/releases/$(date +%Y%m%d%H%M%S)"
SHARED_DIR="${APP_DIR}/shared"
CURRENT_DIR="${APP_DIR}/current"

# Criar diretório da nova release
mkdir -p $NEW_RELEASE_DIR

# Baixar código mais recente
cd $NEW_RELEASE_DIR
git clone https://github.com/seurepositorio/suaapp.git .

# Instalar dependências
composer install --optimize-autoloader --no-dev

# Copiar arquivo de ambiente
cp ${SHARED_DIR}/.env .env

# Criar links para diretórios compartilhados
ln -nfs ${SHARED_DIR}/storage storage
ln -nfs ${SHARED_DIR}/public/uploads public/uploads

# Executar comandos de deploy
php helix migrate --force
php helix config:cache
php helix route:cache
php helix view:cache

# Aquecer cache
php helix cache:warmup

# Trocar symlink atomicamente
ln -nfs $NEW_RELEASE_DIR $CURRENT_DIR

# Recarregar PHP-FPM
sudo service php8.1-fpm reload

# Limpar releases antigas (manter últimas 5)
cd ${APP_DIR}/releases && ls -t | tail -n +6 | xargs rm -rf

echo "Deploy concluído com sucesso!"
```

### Usando Envoy

```php
// Envoy.blade.php
@servers(['web' => 'usuario@exemplo.com'])

@setup
    $repository = 'git@github.com:seurepositorio/suaapp.git';
    $releases_dir = '/var/www/exemplo.com/releases';
    $app_dir = '/var/www/exemplo.com';
    $release = date('YmdHis');
    $new_release_dir = $releases_dir .'/'. $release;
@endsetup

@task('deploy')
    echo 'Clonando repositório'
    [ -d {% raw %}{{ $releases_dir }}{% endraw %} ] || mkdir {% raw %}{{ $releases_dir }}{% endraw %}
    git clone --depth 1 --branch master {% raw %}{{ $repository }}{% endraw %} {% raw %}{{ $new_release_dir }}{% endraw %}

    echo 'Instalando dependências do composer'
    cd {% raw %}{{ $new_release_dir }}{% endraw %}
    composer install --prefer-dist --no-dev --optimize-autoloader

    echo 'Criando link do arquivo .env'
    ln -nfs {% raw %}{{ $app_dir }}{% endraw %}/.env {% raw %}{{ $new_release_dir }}{% endraw %}/.env

    echo 'Criando link do diretório storage'
    ln -nfs {% raw %}{{ $app_dir }}{% endraw %}/storage {% raw %}{{ $new_release_dir }}{% endraw %}/storage

    echo 'Executando migrações'
    cd {% raw %}{{ $new_release_dir }}{% endraw %}
    php helix migrate --force

    echo 'Cacheando configuração'
    php helix config:cache
    php helix route:cache

    echo 'Criando link da release atual'
    ln -nfs {% raw %}{{ $new_release_dir }}{% endraw %} {% raw %}{{ $app_dir }}{% endraw %}/current

    echo 'Reiniciando FPM'
    sudo service php8.1-fpm reload
@endtask
```

Executar deploy:

```bash
envoy run deploy
```

## Deploy com Containers

### Dockerfile

```dockerfile
FROM php:8.1-fpm-alpine

# Instalar dependências
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

# Instalar extensões PHP
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Definir diretório de trabalho
WORKDIR /var/www

# Copiar arquivos da aplicação
COPY . /var/www

# Instalar dependências da aplicação
RUN composer install --optimize-autoloader --no-dev

# Copiar arquivos de configuração
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/php/php.ini /usr/local/etc/php/conf.d/app.ini
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Definir permissões
RUN chown -R www-data:www-data /var/www

# Expor porta
EXPOSE 80

# Iniciar serviços
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

## Monitoramento

### Endpoint de Verificação de Saúde

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

Configure logging adequado para produção:

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

## Otimização de Performance

### Configuração do OPcache

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

### Ajuste do PHP-FPM

```ini
; /etc/php/8.1/fpm/pool.d/www.conf
pm = dynamic
pm.max_children = 50
pm.start_servers = 5
pm.min_spare_servers = 5
pm.max_spare_servers = 35
pm.max_requests = 500
```

## Checklist de Segurança

- [ ] Desabilitar modo de debug (`APP_DEBUG=false`)
- [ ] Definir APP_KEY segura
- [ ] Configurar HTTPS com certificado SSL válido
- [ ] Definir permissões adequadas de arquivo (755 para diretórios, 644 para arquivos)
- [ ] Desabilitar listagem de diretórios
- [ ] Configurar regras de firewall
- [ ] Configurar fail2ban para proteção contra força bruta
- [ ] Atualizações regulares de segurança
- [ ] Configurar estratégia de backup
- [ ] Monitorar logs para atividade suspeita
- [ ] Usar senhas fortes no banco de dados
- [ ] Restringir acesso do banco de dados apenas ao localhost
- [ ] Habilitar logging de consultas para auditoria
- [ ] Configurar limitação de taxa
- [ ] Configurar monitoramento e alertas
