import path from 'path'
import fse from 'fs-extra'
import Promise from 'bluebird'
import getTmpDirPath from './getTmpDirPath'
import readConfigFile from './readConfigFile'

const fsp = Promise.promisifyAll(fse)

describe('readConfigFile()', () => {
  let tmpDir
  const fileContent = 'foo: bar'

  beforeEach(async () => {
    tmpDir = getTmpDirPath()
    await fsp.ensureDirAsync(tmpDir)
  })

  it('should return the file content as an object', async () => {
    const filePath = path.join(tmpDir, '.pipelines.yml')
    await fsp.writeFileAsync(filePath, fileContent)

    const res = await readConfigFile(filePath)

    expect(res).toEqual({ foo: 'bar' })
  })

  it('should throw if provided config file is not correct config file', async () => {
    const filePath = path.join(tmpDir, '.foo.bar')
    await fsp.writeFileAsync(filePath, fileContent)

    // TODO workaround for https://github.com/facebook/jest/issues/3601
    await expect(readConfigFile(filePath)).rejects.toHaveProperty('message')
  })
})
