import runJobs from './runJobs'
import runPipeline from './runPipeline'

jest.mock('./runJobs')

afterAll(() => {
  runJobs.mockRestore()
})

describe('runPipeline()', () => {
  const projectDirPath = '/some/path/my-project'
  const pipeline = [
    {
      name: 'step-1',
      images: [ 'busybox' ],
      commands: [ 'echo hello', 'echo world' ]
    },
    {
      name: 'step-2',
      images: [ 'busybox:latest', 'busybox' ],
      commands: [ 'echo hello', 'echo world' ]
    }
  ]

  beforeEach(() => {
    runJobs.mockReset()
  })

  it('should run a pipeline', async () => {
    runJobs.mockImplementationOnce(() => Promise.resolve([{ id: '1', exitCode: 0 }]))
    runJobs.mockImplementationOnce(() =>
      Promise.resolve([{ id: '1', exitCode: 0 }, { id: '2', exitCode: 0 }]))

    const res = await runPipeline(projectDirPath, pipeline)

    // we get one array back with two job result arrays (one for each step)
    expect(res.length).toEqual(2)
    // the first step was executed in one container --> one job result
    expect(res[0].length).toEqual(1)
    // the second step was executed in two containers --> two job results
    expect(res[1].length).toEqual(2)
  })

  it('should throw if one step in the pipeline returns a non-zero exit code', async () => {
    runJobs.mockImplementationOnce(() => Promise.resolve([{ id: '1', exitCode: 1 }]))
    runJobs.mockImplementationOnce(() =>
      Promise.resolve([{ id: '1', exitCode: 0 }, { id: '2', exitCode: 0 }]))

    // TODO workaround for https://github.com/facebook/jest/issues/3601
    await expect(runPipeline(projectDirPath, pipeline)).rejects.toHaveProperty('message')
  })
})
