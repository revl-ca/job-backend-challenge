# BASE
FROM mhart/alpine-node:8 AS base
MAINTAINER Steve Thomas <steve@revl.ca>

WORKDIR /app
COPY package.json yarn.lock ./

RUN apk update
RUN apk add git
RUN yarn install --production

# APP
FROM mhart/alpine-node:base-8
MAINTAINER Steve Thomas <steve@revl.ca>
ENV PORT 8080

RUN apk add --no-cache curl

WORKDIR /app
COPY --from=base /app .
COPY . .

HEALTHCHECK CMD curl --fail http://localhost:8080/health || exit 1
EXPOSE 8080
CMD ["node", "index.js"]
