## Base URL

{{baseUrl}} = http://localhost:5000/api/v1/

## Swagger Docs

- Open http://localhost:5000/docs in your browser

## Logs

- API request logs are saved in logs/requests.log

## Auth

- POST {{baseUrl}}auth/register
- POST {{baseUrl}}auth/login
- POST {{baseUrl}}auth/logout

## Users

- GET {{baseUrl}}users/me
- PATCH {{baseUrl}}users/profile

## Videos

- GET {{baseUrl}}videos
- GET {{baseUrl}}videos/:id
- POST {{baseUrl}}videos
- PATCH {{baseUrl}}videos/:id
- DELETE {{baseUrl}}videos/:id

## Comments

- GET {{baseUrl}}comments/video/:videoId
- POST {{baseUrl}}comments
- DELETE {{baseUrl}}comments/:id

## Likes

- POST {{baseUrl}}likes
- DELETE {{baseUrl}}likes/:id

## Tweets

- GET {{baseUrl}}tweets
- POST {{baseUrl}}tweets
- DELETE {{baseUrl}}tweets/:id

## Playlists

- GET {{baseUrl}}playlists
- GET {{baseUrl}}playlists/:id
- POST {{baseUrl}}playlists
- PATCH {{baseUrl}}playlists/:id
- DELETE {{baseUrl}}playlists/:id

## Subscriptions

- GET {{baseUrl}}subscriptions
- POST {{baseUrl}}subscriptions
- DELETE {{baseUrl}}subscriptions/channel/:channelId
