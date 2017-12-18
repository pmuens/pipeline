import path from 'path'
import execa from 'execa'
import fse from 'fs-extra'
import Promise from 'bluebird'
import buildContainer from './buildContainer'
import getTmpDirPath from './getTmpDirPath'

const fsp = Promise.promisifyAll(fse)

jest.mock('execa')

execa.mockImplementation(() => Promise.resolve())

afterAll(() => {
  execa.mockRestore()
})

describe('buildContainer()', () => {
  const projectDirPath = '/some/path/my-project'
  let tmpDir

  beforeEach(async () => {
    tmpDir = getTmpDirPath()
    await fsp.ensureDirAsync(tmpDir)
  })

  it('should build the container', async () => {
    const dockerfilePath = path.join(tmpDir, 'my-project.dockerfile')
    await fsp.writeFileAsync(dockerfilePath, 'FROM node:latest', 'utf8')

    await buildContainer(dockerfilePath, projectDirPath)

    expect(execa).toHaveBeenCalledWith('docker', [
      'build',
      '--tag',
      'pipeline/my-project/node:latest',
      '--file',
      dockerfilePath,
      '/some/path/my-project'
    ])
  })
})
