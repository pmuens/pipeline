import path from 'path'
import BbPromise from 'bluebird'
import fse from 'fs-extra'
import hasGitRepository from './hasGitRepository'
import getTmpDirPath from './getTmpDirPath'

const fsp = BbPromise.promisifyAll(fse)

describe('hasGitRepository()', () => {
  let tmpDir

  beforeEach(async () => {
    tmpDir = getTmpDirPath()
    await fsp.ensureDirAsync(tmpDir)
  })

  it('should detect a Git repository', async () => {
    const gitDir = path.join(tmpDir, '.git')
    await fsp.ensureDirAsync(gitDir)

    const res = await hasGitRepository(tmpDir)

    expect(res).toEqual(true)
  })

  it('should return false if no Git repository was found', async () => {
    const otherDir = path.join(tmpDir, 'other-dir')
    await fsp.ensureDirAsync(otherDir)

    const res = await hasGitRepository(tmpDir)

    expect(res).toEqual(false)
  })
})
