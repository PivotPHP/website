FROM ruby:3.1-slim

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

# Configurar diretório de trabalho
WORKDIR /srv/jekyll

# Copiar Gemfile
COPY Gemfile* ./

# Instalar gems
RUN gem install bundler:2.4.22 && \
    bundle install

# Expor porta
EXPOSE 4000 35729

# Comando padrão
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0"]
