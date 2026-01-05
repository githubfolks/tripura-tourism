# Steps to Run
## Navigate to the API directory:
cd api

## Build and Start Services:
docker-compose up -d --build

## Check Status:
docker-compose ps

## View Logs:
docker-compose logs -f

## Verify Endpoints:
Auth:       http://localhost:8001/docs
Catalog:    http://localhost:8002/docs
Inventory:  http://localhost:8003/docs
Booking:    http://localhost:8004/docs

## Stop Services:
docker-compose down
