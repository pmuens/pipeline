import fse from 'fs-extra'
import BbPromise from 'bluebird'
import { not, prepend, is, filter, whereEq } from 'ramda'

/* eslint-disable no-use-before-define */

const fsp = BbPromise.promisifyAll(fse)

function db(config = {}) {
  const filePath = config.filePath || null

  if (not(filePath)) {
    throw new Error('Path to database file not provided')
  }

  async function create() {
    const alreadyExists = await fsp
      .statAsync(filePath)
      .then(() => true)
      .catch(() => false)
    if (alreadyExists) {
      throw new Error(`Database ${filePath} already exists`)
    }

    await fsp.ensureFileAsync(filePath)
    await fsp.writeFileAsync(filePath, '[]')

    return []
  }

  async function insert(obj) {
    if (not(is(Object, obj))) {
      throw new Error('Value must be an object')
    }
    const dbContent = await getDatabaseContent()
    const updatedDbContent = prepend(obj, dbContent)
    await writeDatabaseContent(updatedDbContent)
    return obj
  }

  async function get(query) {
    const dbContent = await getDatabaseContent()
    if (not(query)) {
      return dbContent
    }
    if (not(is(Object, query))) {
      throw new Error('Query must be an object')
    }
    const pred = whereEq(query)
    return filter((elem) => pred(elem), dbContent)
  }

  // 'private' functions
  async function getDatabaseContent() {
    const fileContent = await fsp.readFileAsync(filePath, 'utf8')
    try {
      return JSON.parse(fileContent)
    } catch (err) {
      throw new Error('Database must be in JSON format')
    }
  }

  async function writeDatabaseContent(content) {
    await fsp.writeFileAsync(filePath, JSON.stringify(content), 'utf8')
    return content
  }

  return {
    create,
    insert,
    get,
    getDatabaseContent,
    writeDatabaseContent
  }
}

export default db
