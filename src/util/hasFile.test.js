import path from 'path'
import BbPromise from 'bluebird'
import fse from 'fs-extra'
import hasFile from './hasFile'
import getTmpDirPath from './getTmpDirPath'

const fsp = BbPromise.promisifyAll(fse)

describe('hasFile()', () => {
  let tmpDir
  const fileContent = 'lipsum'

  beforeEach(async () => {
    tmpDir = getTmpDirPath()
    await fsp.ensureDirAsync(tmpDir)
  })

  it('should detect if file is present', async () => {
    const filePath = path.join(tmpDir, 'some-existent-file')
    await fsp.writeFileAsync(filePath, fileContent)

    const res = await hasFile(filePath)
    expect(res).toEqual(true)
  })

  it('should return false if file was not found', async () => {
    const filePath = path.join(tmpDir, 'some-non-existent-file')

    const res = await hasFile(filePath)
    expect(res).toEqual(false)
  })
})
