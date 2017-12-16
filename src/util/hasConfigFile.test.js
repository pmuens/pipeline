import path from 'path'
import Promise from 'bluebird'
import fse from 'fs-extra'
import hasConfigFile from './hasConfigFile'
import getTmpDirPath from './getTmpDirPath'

const fsp = Promise.promisifyAll(fse)

describe('hasConfigFile()', () => {
  let tmpDir
  const fileContent = 'lipsum'

  beforeEach(async () => {
    tmpDir = getTmpDirPath()
    await fsp.ensureDirAsync(tmpDir)
  })

  it('should detect .pipelines.yml file', async () => {
    const filePath = path.join(tmpDir, '.pipelines.yml')
    await fsp.writeFileAsync(filePath, fileContent)

    const res = await hasConfigFile(tmpDir)

    expect(res).toEqual(true)
  })

  it('should return false if no file was found', async () => {
    const filePath = path.join(tmpDir, '.pipelines.foo')
    await fsp.writeFileAsync(filePath, fileContent)

    const res = await hasConfigFile(tmpDir)

    expect(res).toEqual(false)
  })
})
