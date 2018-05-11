# job-backend-challenge

Description: This repository contain the XXXXXX Back-end test that I successfully completed.
Tags: micro-services, docker, node, service-discovery, load-balancing

-- **DO NOT USE IN PRODUCTION** --

## Objective

XXXXXX wants you to create 2 simple micro-service in you language of choice (at XXXXXX we
use Node.js, Java, Scala, Swift, Ruby, Python):

A party dispatcher service (single instance)
- Assigns a user to the party manager that is the geographically the closest to the
user.

A party manager service (1 to n instances, one per geographical region)
- Keeps track of parties assigned to it by the dispatcher, and keeps track of the
participants in the party.

## Requirements

- The micro-services can share the same repository / code base, but services needs to be
able to be started independently
- Each micro-service should expose a REST API with JSON objects over HTTP.
- Available party managers should be configurable via configuration file.
- Create tests (unit and/or integration)
- Answer the questions at the end of the document

**Bonus requirements**

- Implement party leaving in the API
- Implement party participants listing in the API
- Implement party discovery API (nearby parties)

## API

### Dispatcher service

> **Dispatch a manager**
> GET /managers/find?lng=[longitude]&lat=[latitude]
> Returns:
> - hostname of the party manager that we are assigned to (ex: pmng1.us-east.app.com)

### Manager service

> **Create a party**
> POST /parties
> Body: {“device_id”: “[unique_id_of_mobile_device]”}
> Returns:
> - status code
> - party_code (ex: 457495738)
> - participant_id (ex: 0)

> **Join a party**
> POST /parties/[party_code]/participants
> Body: {“device_id”: “[unique_id_of_mobile_device]”, “participant_name”: “[name_of_participants]”}
> Returns:
> - status code
> - party_code (ex: 457495738)
> - participant_id (ex: 1)

## Feedback Questions
1) Before doing the test, how long did you think it would take you to complete the assignment?
2) How long did you take to complete the assignment?
3) With more time, how would you improve your solution?
4) Right now, we assume we have one manager per geographical region, but we may have to over allocate managers if the number of users increase in a specific region. Propose a way to scale horizontally the number of managers for a given region by preventing, ideally, hotspots.
5) How could you create more than one dispatcher and load balance the requests among them?
6) How would you deploy your micro-services to the cloud?
7) How could you minimize the cost of the infrastructure by taking into account the diurnal internet traffic pattern by region?
8) On a scale of 1 to 10, 10 being the hardest, How hard was this assignment?

## What I added

1) When a master leave the party, a slave is promoted as the new master.
2) Managers are auto discovered.
3) Added endpoints.

## The caveats of my implementation

1) Do not use **docker-compose** in production.
2) Some containers are mapping **docker.sock**. Not recommended unless you deploy on a RHEL OS with SELinux.
3) The Manager service use **SQLite** and this is not shared among replicas.
4) No tests written but Swagger is in there. Use `make swagger`.

## Additional information

On your dev machine, you will need some DNS entries to your **/etc/hosts**
> 127.0.0.1 dispatcher.app.local
> 127.0.0.1 us-east-1.app.local
> 127.0.0.1 ca-central-1.app.local
> 127.0.0.1 eu-central-1.app.local
