import path from 'path'
import execa from 'execa'
import fse from 'fs-extra'
import BbPromise from 'bluebird'
import buildContainer from './buildContainer'
import getTmpDirPath from '../getTmpDirPath'

const fsp = BbPromise.promisifyAll(fse)

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

    const tag = await buildContainer(dockerfilePath, projectDirPath)

    const expectedTag = 'pipeline/my-project/node:latest'
    expect(execa).toHaveBeenCalledWith('docker', [
      'build',
      '--tag',
      expectedTag,
      '--file',
      dockerfilePath,
      '/some/path/my-project'
    ])
    expect(tag).toEqual(expectedTag)
  })
})
