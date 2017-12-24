import runJob from './runJob'
import {
  writeDockerfile,
  buildContainer,
  runContainer,
  waitForCompletion,
  getContainerLogs,
  inspectContainer,
  cleanupDockerfiles
} from '../util/docker'

jest.mock('../util/docker', () => ({
  writeDockerfile: jest.fn(() =>
    Promise.resolve('/some/path/my-project/.pipeline.busybox.dockerfile')),
  buildContainer: jest.fn(() => Promise.resolve('some-container-name')),
  runContainer: jest.fn(() => Promise.resolve('some-container-id')),
  waitForCompletion: jest.fn(() => Promise.resolve()),
  getContainerLogs: jest.fn(() =>
    Promise.resolve([
      { message: 'hello', timestamp: new Date() },
      { message: 'world', timestamp: new Date() }
    ])),
  inspectContainer: jest.fn(() =>
    Promise.resolve({
      Id: 'some-container-id',
      State: {
        ExitCode: 0
      }
    })),
  cleanupDockerfiles: jest.fn(() => Promise.resolve([ '.pipeline.busybox.dockerfile' ]))
}))

afterAll(() => {
  writeDockerfile.mockRestore()
  buildContainer.mockRestore()
  runContainer.mockRestore()
  waitForCompletion.mockRestore()
  getContainerLogs.mockRestore()
  inspectContainer.mockRestore()
  cleanupDockerfiles.mockRestore()
})

describe('runJob()', () => {
  it('should run a Pipeline job', async () => {
    const projectDirPath = '/some/path/my-project'
    const image = 'busybox'
    const commands = [ 'echo hello', 'echo world' ]

    const jobResult = await runJob(projectDirPath, image, commands)

    expect(writeDockerfile).toHaveBeenCalledWith(projectDirPath, 'busybox')
    expect(buildContainer).toHaveBeenCalledWith(
      projectDirPath,
      '/some/path/my-project/.pipeline.busybox.dockerfile'
    )
    expect(runContainer).toHaveBeenCalledWith('some-container-name', commands)
    expect(waitForCompletion).toHaveBeenCalledWith('some-container-id', 2500)
    expect(getContainerLogs).toHaveBeenCalledWith('some-container-id')
    expect(inspectContainer).toHaveBeenCalledWith('some-container-id')
    expect(cleanupDockerfiles).toHaveBeenCalledWith(projectDirPath)

    expect(Object.keys(jobResult)).toEqual([
      'id',
      'containerId',
      'containerName',
      'image',
      'projectDirPath',
      'exitCode',
      'logs',
      'startedAt',
      'finishedAt'
    ])
    expect(jobResult.id).toMatch(/.+-.+/) // TODO sloppy uuid matching
    expect(jobResult).toHaveProperty('containerId', 'some-container-id')
    expect(jobResult).toHaveProperty('containerName', 'some-container-name')
    expect(jobResult).toHaveProperty('image', 'busybox')
    expect(jobResult).toHaveProperty('projectDirPath', projectDirPath)
    expect(jobResult).toHaveProperty('exitCode', 0)
    expect(jobResult.logs[0].message).toEqual('hello')
    expect(jobResult.logs[0].timestamp).toBeInstanceOf(Date)
    expect(jobResult.logs[1].message).toEqual('world')
    expect(jobResult.logs[1].timestamp).toBeInstanceOf(Date)
    expect(jobResult.startedAt).toBeInstanceOf(Date)
    expect(jobResult.finishedAt).toBeInstanceOf(Date)
  })
})
