import fs from 'node:fs'

export default class JSONDB {
  #db = {}
  #path = 'db.json'
  #updating = false


  constructor(path) {
    if (path) this.#path = path
    console.log('Initializing db from:', this.#path)

    const stat = fs.statSync(this.#path, {throwIfNoEntry: false})
    if (typeof stat !== 'undefined') {
      const data = fs.readFileSync(this.#path, {encoding: "utf8"})
      if (data.trim() !== '') this.#db = JSON.parse(data)
      console.log('Initialized db:', this.#db)
    } else {
      console.warn('No db file found, starting with local only.')
    }
  }


  update(data) {
    if (this.#updating) return
    this.#updating = true

    const newData = data ?? JSON.stringify(this.#db)

    fs.writeFile(this.#path, newData, (err) => {
      if (err) throw err
      console.info('Updated db:', newData)

      const current = JSON.stringify(this.#db)
      this.#updating = false
      if (newData !== current) this.update(current)
    })
  }


  get(id) {
    return this.#db[id]
  }


  set(id, val) {
    if (JSON.stringify(val) === JSON.stringify(this.get(id))) return
    this.#db[id] = val
    return this.update()
  }


  del(id) {
    if (!this.has(id)) return
    delete this.#db[id]
    return this.update()
  }


  has(id) {
    return (id in this.#db)
  }


  reset() {
    this.#db = {}
    return this.update()
  }


  get db() {
    return this.#db
  }


  set db(value) {
    this.#db = value
    this.update()
  }


  get json() {
    return JSON.stringify(this.#db)
  }
}
