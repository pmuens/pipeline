import path from 'path'
import fse from 'fs-extra'
import BbPromise from 'bluebird'
import writeDockerfile from './writeDockerfile'
import getTmpDirPath from './getTmpDirPath'

const fsp = BbPromise.promisifyAll(fse)

describe('writeDockerfile()', () => {
  let tmpDir

  beforeEach(async () => {
    tmpDir = getTmpDirPath()
    await fsp.ensureDirAsync(tmpDir)
  })

  it('should write the enhanced Dockerfile', async () => {
    const image = 'pipeline/alpine-node:latest'

    const dockerfilePath = await writeDockerfile(tmpDir, image)
    const dockerfileContent = await fsp.readFileAsync(dockerfilePath, 'utf8')
    const firstLine = dockerfileContent.split('\n')[0]

    expect(dockerfilePath).toEqual(path.join(tmpDir, '.pipeline.pipeline-alpine-node-latest.dockerfile'))
    expect(firstLine).toEqual('FROM pipeline/alpine-node:latest')
    expect(dockerfileContent).toMatch(/COPY . \/usr\/src\/app/)
  })
})
