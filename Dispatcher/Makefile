SWAGGER_PORT=8888

build:
	docker build -t app/dispatcher .

test:

swagger:
	docker run -p $(SWAGGER_PORT):8080 -e API_URL=http://eu-central-1.app.local/swagger.json swaggerapi/swagger-ui
