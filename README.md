# CoCo

A platform for coding and collaborating for students and teachers.

## Installation

1. Clone the repository
2. Install bun with `npm install -g bun`
3. Install dependencies with `bun install`
4. Create a .env from the .env.example file with the following variables:
   - DATABASE_URL: The URL of the Postgres database
   - NEXT_PUBLIC_RAPID_API_KEY: The API key for the judge0 API
5. Run the start database script with `./start-database.sh` (given by T3, but changed to account for testing)
6. Setup the database with `bun run db:push`
7. Go to the following rapid API https://rapidapi.com/judge0-official/api/judge0-ce. Create account and subscribe to the API to get a key. Copy the key and paste it in the .env file for NEXT_PUBLIC_RAPID_API_KEY.
8. Run the app with `bun run dev`
9. Go to http://localhost:3000 to see the app. This will prompt for a login, which is not present in the db by default.
10. Open prisma studio and create a user. This can be done via `bun run db:studio`. Inside Studio, first create a group with the name "testGroup". Then create a user in the group with the username "testUser" and password "testUser" (under User model add a user, then assign the user to the group).

## Testing

1. install playwright dependencies and browsers with `npx playwright install`. (this is not supported if using arch linux)

Before running tests, the Render server for the websocket (for codemirror) needs to be running and not idle. To prompt the Render server to start, first run the tests (they will fail on code editor), then wait 2 minutes and then run again.


To run the tests, run `bun run test` in the terminal. There is an issue where the development server may not start by itself, so you may need to run the ./start-database.sh script again and make sure this process is running before running the tests.

It is also possible to run the tests in a headed enironment with `bun run test:headed`.