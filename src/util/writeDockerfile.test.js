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

    const dockerfilePath = await writeDockerfile(tmpDir, image)
    const dockerfileContent = await fsp.readFileAsync(dockerfilePath, 'utf8')
    const firstLine = dockerfileContent.split('\n')[0]

    expect(dockerfilePath).toEqual(path.join(tmpDir, '.pipeline.dockerfile'))
    expect(firstLine).toEqual('FROM node:latest')
    expect(dockerfileContent).toMatch(/FROM node:latest/)
    expect(dockerfileContent).toMatch(/COPY . \/usr\/src\/app/)
  })
})
