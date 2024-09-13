

get-dev-data:
    curl http://wimpy.bleak-moth.ts.net/static/data.jsonl > public/data.jsonl

run-dev:
    npm run dev

build:
    rm -rf dist
    npm run build
