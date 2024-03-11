# Nestjs Auth Starter

This is a personal starting point for nestjs rest api's that use jwt authentication.

## Quick Start

1. Clone the repository

```sh
git clone https://github.com/msyavuz/nest-auth-starter.git
```

2. Install dependencies

```sh
npm install
```

3. Configure environment variables

```
// Turso
DB_URL=<string>
DB_TOKEN=<string>

JWT_SECRET_ACCESS=<string>
JWT_SECRET_REFRESH=<string>

COOKIE_SECRET=<string>
```


4. Run the server
```sh
npm run start:dev
```
> [!NOTE]
> You can preview all endpoints in swagger ui in `/api` endpoint

## Endpoints

- `/auth/register`

Creates a user with username email and password provided in request body.
Returns a response with refresh_token in httponly cookie and a json:

```json
{
    "access_token": <TOKEN>
}
```

- `/auth/login`

Checks users username and password and returns the same response as register endpoint if user is authenticated.

- `/auth/refresh`

Returns the same response as register but guarded by RefreshGuard.

## Guards

- `AccessGuard`

If the endpoint is not public verifies the jwt token in request body and attaches the payload to request if successful.

- `RefreshGuard`

Verifies refresh token in request cookies and attaches the payload to request if successful.

## Users Resource

Users resource can be altered according to your needs. I used drizzle and turso but both can be switched out.
