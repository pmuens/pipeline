import path from 'path'
import fse from 'fs-extra'
import BbPromise from 'bluebird'
import getTmpDirPath from '../getTmpDirPath'
import cleanupDockerfiles from './cleanupDockerfiles'

const fsp = BbPromise.promisifyAll(fse)

describe('cleanupDockerfiles()', () => {
  let tmpDir
  let dockerfileOne
  let dockerfileTwo
  let otherFile
  let otherDirectory

  beforeEach(async () => {
    tmpDir = getTmpDirPath()
    dockerfileOne = path.join(tmpDir, '.pipeline.file-one.dockerfile')
    dockerfileTwo = path.join(tmpDir, '.pipeline.file-two.dockerfile')
    otherFile = path.join(tmpDir, 'other-file.foo')
    otherDirectory = path.join(tmpDir, 'nested-dir')
    await fsp.ensureDirAsync(tmpDir)
    await fsp.writeFileAsync(dockerfileOne, '')
    await fsp.writeFileAsync(dockerfileTwo, '')
    await fsp.writeFileAsync(otherFile, '')
    await fsp.ensureDirAsync(otherDirectory)
  })

  it('should remove all Pipeline Dockerfiles', async () => {
    const removedFiles = await cleanupDockerfiles(tmpDir)

    const dirContent = await fsp.readdirAsync(tmpDir)

    expect(removedFiles).toEqual([ '.pipeline.file-one.dockerfile', '.pipeline.file-two.dockerfile' ])
    expect(dirContent).not.toContain('.pipeline.file-one.dockerfile')
    expect(dirContent).not.toContain('.pipeline.file-two.dockerfile')
    expect(dirContent).toContain('other-file.foo')
    expect(dirContent).toContain('nested-dir')
  })
})
