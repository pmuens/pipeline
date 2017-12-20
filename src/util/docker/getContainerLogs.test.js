import execa from 'execa'
import getContainerLogs from './getContainerLogs'

jest.mock('execa')

execa.mockImplementation(() => Promise.resolve({ stdout: 'some logs' }))

afterAll(() => {
  execa.mockRestore()
})

describe('getContainerLogs()', () => {
  it('should return the container logs', async () => {
    const containerId = 'some-container-id'

    const logs = await getContainerLogs(containerId)

    expect(logs).toEqual('some logs')
    expect(execa).toHaveBeenCalledWith('docker', [ 'logs', containerId ])
  })
})
