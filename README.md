# Moneyhub Tech Test - Investments and Holdings

At Moneyhub we use microservices to partition and separate the concerns of the codebase. In this exercise we have given you an example `admin` service and some accompanying services to work with. In this case the admin service backs a front end admin tool allowing non-technical staff to interact with data.

A request for a new admin feature has been received

## Requirements

- As an admin, I want to be able to generate a CSV report showing the values of all user investment holdings
  - Any new routes should be added to the **admin** service
  - The csv report should be sent to the `/export` route of the **investments** service
  - The investments `/export` route expects the following:
    - content-type as `application/json`
    - JSON object containing the report as csv string, i.e, `{csv: '|User|First Name|...'}`
  - The csv should contain a row for each holding matching the following headers
    |User|First Name|Last Name|Date|Holding|Value|
  - The **Holding** property should be the name of the holding account given by the **financial-companies** service
  - The **Value** property can be calculated by `investmentTotal * investmentPercentage`
  - The new route in the admin service handling the generation of the csv report should return the csv as text with content type `text/csv`
- Ensure use of up to date packages and libraries (the service is known to use deprecated packages but there is no expectation to replace them)
- Make effective use of git

We prefer:

- Functional code
- Ramda.js (this is not a requirement but feel free to investigate)
- Unit testing

### Notes

All of you work should take place inside the `admin` microservice

For the purposes of this task we would assume there are sufficient security middleware, permissions access and PII safe protocols, you do not need to add additional security measures as part of this exercise.

You are free to use any packages that would help with this task

We're interested in how you break down the work and build your solution in a clean, reusable and testable manner rather than seeing a perfect example, try to only spend around _1-2 hours_ working on it

## Deliverables

**Please make sure to update the readme with**:

- Your new routes
- How to run any additional scripts or tests you may have added
- Relating to the task please add answers to the following questions;
  1. How might you make this service more secure?
  2. How would you make this solution scale to millions of records?
  3. What else would you have liked to improve given more time?

On completion email a link to your repository to your contact at Moneyhub and ensure it is publicly accessible.

## Getting Started

Please clone this service and push it to your own github (or other) public repository

To develop against all the services each one will need to be started in each service run

```bash
npm start
or
npm run develop
```

The develop command will run nodemon allowing you to make changes without restarting

The services will try to use ports 8081, 8082 and 8083

Use Postman or any API tool of you choice to trigger your endpoints (this is how we will test your new route).

### Existing routes

We have provided a series of routes

Investments - localhost:8081

- `/investments` get all investments
- `/investments/:id` get an investment record by id
- `/investments/export` expects a csv formatted text input as the body

Financial Companies - localhost:8082

- `/companies` get all companies details
- `/companies/:id` get company by id

Admin - localhost:8083

- `/investments/:id` get an investment record by id
- `/investments/report` generate all holdings as csv formatted text for the `/investments/export` endpoint

### Q&A

## 1. How might you make this service more secure?

The URLs are HTTP, so I'd change those to HTTPS if that isn't a breaking change for the api. The endpoint doesn't have validation on it beyond being a JSON object, so I'd look to improve that with better specificity. If resources were there, I'd also be keen to protect all of these endpoints behind a login or other method of authentication.

## 2. How would you make this solution scale to millions of records?

I'd add sleep commands to make sure there was a small period of rest between requests, and/or paginate the data to limit the size of the response. We could also run this through a scheduler, perhaps amending a csv string with the newest holdings every (for example) 24 hours, removing the need for any manual call at all. (This is presupposing historical data doesn't change, which isn't certain.)

## 3. What else would you have liked to improve given more time?

There's a lot I would like to improve about this solution; I took the two hours to put this together, with the approach of building a working first pass before improving and optimising. To be fair to the time limit I didn't get the chance to write unit tests, which is an obvious first step to make sure everything is behaving as it should be. I'm also not happy that the new endpoint is leaning on so many others - it's not DRY to create that kind of dependency, and I'd at least have the `/investments` and `/companies` endpoints be exported through middleware so that any changes to them would cover both endpoints. It was a requirement of the task that the csv report be sent to the `/investments/export` route once generated so I did as instructed there but I would push against this in a real situation. The endpoint function is pretty bloated, so I'd look to spin out some of those into smaller reusable functions. I'd also make sure I understood the front-end use case for this and check how the data was handled once it reached the UI. Finally, it's not ideal for the JSON to be converted to CSV and then back again; with more time I'd look to implement a solution that builds the csv first and then wraps it in the JSON rather than converting back and forth.
