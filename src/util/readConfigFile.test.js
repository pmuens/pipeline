import path from 'path'
import fse from 'fs-extra'
import BbPromise from 'bluebird'
import getTmpDirPath from './getTmpDirPath'
import readConfigFile from './readConfigFile'

const fsp = BbPromise.promisifyAll(fse)

describe('readConfigFile()', () => {
  let tmpDir
  const fileContent = 'foo: bar'

  beforeEach(async () => {
    tmpDir = getTmpDirPath()
    await fsp.ensureDirAsync(tmpDir)
  })

  it('should return the file content as an object', async () => {
    const filePath = path.join(tmpDir, '.pipeline.yml')
    await fsp.writeFileAsync(filePath, fileContent)

    const res = await readConfigFile(filePath)

    expect(res).toEqual({ foo: 'bar' })
  })

  it('should throw if provided config file is not correct config file', async () => {
    const filePath = path.join(tmpDir, '.foo.bar')
    await fsp.writeFileAsync(filePath, fileContent)

    await expect(readConfigFile(filePath)).rejects.toThrow('not a Pipeline config')
  })
})
