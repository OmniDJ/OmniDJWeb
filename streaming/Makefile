TEMPLATE_NAME ?= janus-webrtc-gateway-docker

build:
	@docker build -t omnidj/$(TEMPLATE_NAME) .

build-nocache:
	@docker build --no-cache -t omnidj/$(TEMPLATE_NAME) .

bash: 
	@docker run --rm --net=host --name="omnidj" -it -t omnidj/$(TEMPLATE_NAME) /bin/bash

run: 
	@docker run -d --restart unless-stopped  --net=host --name="omnidj" -it -t omnidj/$(TEMPLATE_NAME)

run-mac: 
	@docker run --rm -p 80:80 -p 8088:8088 -p 8188:8188 --name="omnidj" -it -t omnidj/$(TEMPLATE_NAME)

run-hide: 
	@docker run --rm --net=host --name="omnidj" -it -t omnidj/$(TEMPLATE_NAME) >> /dev/null
