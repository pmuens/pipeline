import path from 'path'
import BbPromise from 'bluebird'
import fse from 'fs-extra'
import hasDirectory from './hasDirectory'
import getTmpDirPath from './getTmpDirPath'

const fsp = BbPromise.promisifyAll(fse)

describe('hasDirectory()', () => {
  let tmpDir

  beforeEach(async () => {
    tmpDir = getTmpDirPath()
    await fsp.ensureDirAsync(tmpDir)
  })

  it('should detect if directory is present', async () => {
    const dirPath = path.join(tmpDir, 'some-existent-dir')
    await fsp.ensureDirAsync(dirPath)

    const res = await hasDirectory(dirPath)
    expect(res).toEqual(true)
  })

  it('should return false if directory was not found', async () => {
    const otherDir = path.join(tmpDir, 'some-non-existent-dir')

    const res = await hasDirectory(otherDir)
    expect(res).toEqual(false)
  })
})
