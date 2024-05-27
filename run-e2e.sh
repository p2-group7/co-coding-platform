#!/usr/bin/env bash
DIR="$(cd "$(dirname "$0")" && pwd)"

env DATABASE_TEST=true $DIR/start-database.sh

bun prisma db push --force-reset // force reset to make sure the database is empty

if [ "$#" -eq  "0" ]

  then

    npx playwright test --retries=3

else

    npx playwright test --headed --retries=3

fi

npx playwright show-report