import path from 'path'
import BbPromise from 'bluebird'
import fse from 'fs-extra'
import getTmpDirPath from '../getTmpDirPath'
import db from './db'

const fsp = BbPromise.promisifyAll(fse)

describe('db', () => {
  let tmpDir
  let filePath

  beforeEach(async () => {
    tmpDir = getTmpDirPath()
    await fsp.ensureDirAsync(tmpDir)
    filePath = path.join(tmpDir, 'pipeline.db')
  })

  describe('db()', () => {
    it('should throw if the path to the database file is not provided', async () => {
      await expect(db).toThrowError('database file not provided')
    })
  })

  describe('create()', () => {
    it('should create a new and empty database', async () => {
      const DB = db({ filePath })
      const res = await DB.create()

      expect(res).toEqual([])
    })

    it('should throw if the database already exists', async () => {
      await fsp.ensureFileAsync(filePath)
      const DB = db({ filePath })

      // TODO workaround for https://github.com/facebook/jest/issues/3601
      await expect(DB.create()).rejects.toHaveProperty('message')
    })
  })

  describe('insert()', () => {
    let DB

    beforeEach(async () => {
      DB = db({ filePath })
    })

    it('should insert an entry into the database', async () => {
      await fsp.writeFileAsync(filePath, '[]')
      const obj = { new: 'value' }
      const res = await DB.insert(obj)

      expect(res).toEqual(obj)
    })

    it('should prepend the new entry', async () => {
      await fsp.writeFileAsync(filePath, '[{ "old": "value" }]')
      const obj = { new: 'value' }
      await DB.insert(obj)

      let dbContent = await fsp.readFileAsync(filePath)
      dbContent = JSON.parse(dbContent)

      expect(dbContent[0]).toEqual(obj)
    })

    it('should throw if entry is not an object', async () => {
      await fsp.writeFileAsync(filePath, '[]')
      const obj = 'invalid value'

      // TODO workaround for https://github.com/facebook/jest/issues/3601
      await expect(DB.insert(obj)).rejects.toHaveProperty('message')
    })
  })

  describe('get()', () => {
    let DB

    beforeEach(async () => {
      DB = db({ filePath })
      await fsp.writeFileAsync(filePath, '[{ "id": "1234" }, { "id": "5678" } ]')
    })

    it('should return the data based on the query', async () => {
      const query = { id: '5678' }
      const res = await DB.get(query)

      expect(res).toEqual([{ id: '5678' }])
    })

    it('should throw if query is not an object', async () => {
      const query = 'invalid query'

      // TODO workaround for https://github.com/facebook/jest/issues/3601
      await expect(DB.get(query)).rejects.toHaveProperty('message')
    })

    it('should return all data if no query object is provided', async () => {
      const res = await DB.get()

      expect(res).toEqual([{ id: '1234' }, { id: '5678' }])
    })
  })

  // 'private' functions
  describe('getDatabaseContent()', () => {
    let DB

    beforeEach(() => {
      DB = db({ filePath })
    })

    it('should return the parsed file content', async () => {
      await fsp.writeFileAsync(filePath, '[{ "some": "value" }]')
      const res = await DB.getDatabaseContent()

      expect(res).toEqual([{ some: 'value' }])
    })

    it('should throw if file content is not in JSON format', async () => {
      await fsp.writeFileAsync(filePath, 'some invalid format')

      // TODO workaround for https://github.com/facebook/jest/issues/3601
      await expect(DB.getDatabaseContent()).rejects.toHaveProperty('message')
    })
  })

  describe('writeDatabaseContent()', () => {
    let DB

    beforeEach(async () => {
      DB = db({ filePath })
      await fsp.ensureFileAsync(filePath)
    })

    it('should persist the given content', async () => {
      const content = [{ some: 'value' }]
      await DB.writeDatabaseContent(content)

      let dbContent = await fsp.readFileAsync(filePath)
      dbContent = JSON.parse(dbContent)

      expect(dbContent).toEqual(content)
    })
  })
})
