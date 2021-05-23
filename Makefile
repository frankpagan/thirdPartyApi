build:
	docker compose build

up:
	docker compose up -d server 
	
recreate:
	docker compose up --force-recreate 
	
start:
	docker compose start

restart:
	docker compose restart

stop:
	docker compose stop

shell-server:
	docker exec -it cocreateapi_server_1 /bin/sh
	
log-server:
	docker compose logs -f --tail 20 server

rebuild:
	docker compose down && docker-compose build && docker-compose up -d server