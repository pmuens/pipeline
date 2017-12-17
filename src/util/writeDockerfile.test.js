import path from 'path'
import fse from 'fs-extra'
import Promise from 'bluebird'
import writeDockerfile from './writeDockerfile'
import getTmpDirPath from './getTmpDirPath'

const fsp = Promise.promisifyAll(fse)

describe('writeDockerfile()', () => {
  let tmpDir

  beforeEach(async () => {
    tmpDir = getTmpDirPath()
    await fsp.ensureDirAsync(tmpDir)
  })

  it('should write the enhanced Dockerfile', async () => {
    const image = 'node:latest'

    await writeDockerfile(tmpDir, image)

    const dockerfile = path.join(tmpDir, 'Dockerfile')
    const res = await fsp.readFileAsync(dockerfile, 'utf8')

    expect(res).toMatch(/FROM node:latest/)
    expect(res).toMatch(/ONBUILD COPY . \/usr\/src\/app/)
  })
})
