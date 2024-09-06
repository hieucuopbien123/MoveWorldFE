start-build:
	docker compose -f docker-compose.yml up --build -d
	
start:
	docker compose -f docker-compose.yml up -d

stop:
	docker compose -f docker-compose.yml down