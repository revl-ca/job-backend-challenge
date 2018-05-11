SWAGGER_PORT=8888

build:
	node node_modules/.bin/sequelize db:migrate && \
	docker build -t app/manager .

test:

swagger:
	docker run -p $(SWAGGER_PORT):8080 -e API_URL=http://us-east-1.app.local/swagger.json swaggerapi/swagger-ui
