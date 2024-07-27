const args = process.argv.slice(2);
let path
let port

while(args.length) {
  const option = args.shift()
  let value
  switch (option) {
    case '-h':
    case '--help':
      console.log('Usage: node index.js <-d|--db db_path> <-p|--port port>')
      process.exit()
    case '-d':
    case '--db':
      value = args.shift()
      if (!value || value.charAt(0) === '-') throw 'missing parameter for option: db'
      if (value) path = value
      break
    case '-p':
    case '--port':
      value = args.shift()
      if (!value || value.charAt(0) === '-') throw 'missing parameter for option: port'
      if (value) port = value
      break
    default:
      throw `Unrecognized option: ${option}`
  }
}


const p = import('./JSONDB.mjs')
let db

const express = require('express')
const app = express()

p.then(v => {
  const { default: JSONDB } = v
  db = new JSONDB(path);


  app.listen(port ?? 3000, () => {
    console.log(`DB app listening on port ${port ?? 3000}`)
  })
})


app.get('/', (req, res) => {
  res.sendStatus(204)
})


const router = express.Router()
app.use('/api', router)

router.use(express.json())

router.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) res.locals.invalidJSON = true
  next();
});

router.get('/', (req, res) => {
  res.json({ok: true, db: db.db})
})

router.get('/:key', (req, res) => {
  if (!db.has(req.params.key)) {
    res.status(404).json({ok: false, reason: 'key does not exist'})
  } else {
    const value = db.get(req.params.key)
    res.json({ok: true, value})
  }
})

router.post('/', (req, res) => {
  if (res.locals.invalidJSON) {
    res.status(400).json({ok: false, reason: 'data is not valid json'})
    return
  }
  const {key, value} = req.body
  if (typeof key !== 'string') {
    res.status(400).json({ok: false, reason: 'invalid key'})
  } if (typeof value === 'undefined') {
    res.status(400).json({ok: false, reason: 'missing field: value'})
  } else {
    db.set(key, value)
    res.json({ok: true})
  }
})

router.put('/:key', (req, res) => {
  if (res.locals.invalidJSON) {
    res.status(400).json({ok: false, reason: 'data is not valid json'})
    return
  }
  const {value} = req.body
  if (typeof value === 'undefined') {
    res.status(400).json({ok: false, reason: 'missing field: value'})
  } else {
    db.set(req.params.key, value)
    res.json({ok: true})
  }
})

router.delete('/', (req, res) => {
  db.reset()
  res.json({ok: true})
})

router.delete('/:key', (req, res) => {
  if (!db.has(req.params.key)) {
    res.status(404).json({ok: false, reason: 'key does not exist'})
  } else {
    db.del(req.params.key)
    res.json({ok: true})
  }
})
