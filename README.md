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

- [npm_pack_install](https://gist.github.com/gilbertchu/2288c75ada879392ea141394875960fe)
- [express.js](https://expressjs.com/)

```console
# get npm_pack_install
curl -sS \
  https://gist.githubusercontent.com/gilbertchu/2288c75ada879392ea141394875960fe/raw/50cc0c4c8588321b9e180a3de52300fa26759582/npm_pack_install.sh > \
  /home/gilbert/.local/bin/npm_pack_install

# install node dependency without package.json
npm_pack_install express
```

Starting the listen server:

```console
node json-db/index.js \
  --db /path/to/db.json \
  --port 3000 \
  --auth password
# auth is optional
```

Interacting with the DB:

```console
# create/update key-value pair with POST:
curl --header "Content-Type: application/json" \
  --header "Auth: password" \
  --request POST \
  --data '{"key":"new-key","value":"a value"}' \
  http://localhost:3000/api
# {"ok":true}

# create/update key-value pair with PUT:
curl --header "Content-Type: application/json" \
  --header "Auth: password" \
  --request PUT \
  --data '{"value":"new value"}' \
  http://localhost:3000/api/new-key
# {"ok":true}

# get existing value:
curl --header "Auth: password" http://localhost:3000/api/new-key
# {"ok":true,"value":"new value"}

# get entire db:
curl --header "Auth: password" http://localhost:3000/api
# {"ok":true,"db":{"new-key":"new value"}}

# delete existing value:
curl --header "Auth: password" \
  --request DELETE \
  http://localhost:3000/api/new-key
# {"ok":true}

# reset (delete all):
curl --header "Auth: password" \
--request DELETE \
http://localhost:3000/api
# {"ok":true}
```
