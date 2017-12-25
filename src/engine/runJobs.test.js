import runJob from './runJob'
import runJobs from './runJobs'

jest.mock('./runJob')

runJob.mockImplementationOnce(() => Promise.resolve({ some: 'job-result1' }))
runJob.mockImplementationOnce(() => Promise.resolve({ some: 'job-result2 ' }))

afterAll(() => {
  runJob.mockRestore()
})

// TODO add test case for parallel job-execution
describe('runJobs()', () => {
  it('should run multiple jobs', async () => {
    const projectDirPath = '/some/path/my-project'
    const images = [ 'node:lates', 'node:9' ]
    const commands = [ 'echo hello', 'echo world' ]

    const jobResults = await runJobs(projectDirPath, images, commands, 2)

    expect(jobResults.length).toEqual(2)
    expect(jobResults[0]).not.toBeUndefined()
    expect(jobResults[0]).not.toBeNull()
    expect(jobResults[0]).not.toEqual({})
    expect(jobResults[1]).not.toBeUndefined()
    expect(jobResults[1]).not.toBeNull()
    expect(jobResults[1]).not.toEqual({})
  })
})
