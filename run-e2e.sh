#!/usr/bin/env bash
DIR="$(cd "$(dirname "$0")" && pwd)"

env DATABASE_TEST=true $DIR/start-database.sh

bun prisma db push

if [ "$#" -eq  "0" ]

  then

    npx playwright test

else

    npx playwright test --headed

fi

npx playwright show-report