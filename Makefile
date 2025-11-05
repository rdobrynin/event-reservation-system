run:
	@make down && make up && make db-migration

up:
	@docker-compose up -d

db-migration:
	@docker exec event-reservation-system-backend yarn migration:run

app_shell:
	@docker exec -it event-reservation-system-backend sh

db:
	@docker exec event-reservation-system-backend yarn migration:run

db-revert:
	@docker exec event-reservation-system-backend yarn migration:revert

down:
	@docker-compose down --remove-orphans
