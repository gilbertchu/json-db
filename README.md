# JSONDB

A simple JSON text file database + webserver api.

## JS module usage

Can import module directly:

```js
import JSONDB from './JSONDB.mjs'
const db = new JSONDB('/path/to/db.json'); // default path is "db.json" (relative path)
db.set('a key', 'a value')
db.get('a key') // 'a value'
```

## Web API Usage

Setup dependencies:

```sh
npm_pack_install express # get npm_pack_install: https://gist.github.com/gilbertchu/2288c75ada879392ea141394875960fe
```

Starting the listen server:

```sh
node index.js --db /path/to/db.json --port 3000
```

Interacting with the DB:

```sh
# create/update key-value pair with POST:
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"key":"new-key","value":"a value"}' \
  http://localhost:3000/api # {"ok":true}

# create/update key-value pair with PUT:
curl --header "Content-Type: application/json" \
  --request PUT \
  --data '{"value":"new value"}' \
  http://localhost:3000/api/new-key # {"ok":true}

# get existing value:
curl http://localhost:3000/api/new-key # {"ok":true,"value":"new value"}

# get entire db:
curl --request GET http://localhost:3000/api # {"ok":true,db:{"new-key":"new value"}}

# delete existing value:
curl --request DELETE http://localhost:3000/api/new-key # {"ok":true}

# reset (delete all):
curl --request DELETE http://localhost:3000/api # {"ok":true}
```
