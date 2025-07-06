.PHONY: serve build install clean docker-serve docker-build

# Local development (requires Ruby)
install:
	bundle install

serve:
	bundle exec jekyll serve --watch

build:
	bundle exec jekyll build

clean:
	bundle exec jekyll clean

# Docker development (no Ruby needed)
docker-serve:
	docker-compose up

docker-build:
	docker run --rm -v "$(PWD):/srv/jekyll" jekyll/jekyll:latest jekyll build

docker-install:
	docker run --rm -v "$(PWD):/srv/jekyll" jekyll/jekyll:latest bundle install