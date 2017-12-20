import execa from 'execa'
import getContainerState from './getContainerState'

jest.mock('execa')

execa.mockImplementation(() =>
  Promise.resolve({
    stdout: '{ "Status":"exited", "ExitCode":0 }'
  }))

afterAll(() => {
  execa.mockRestore()
})

describe('getContainerState()', () => {
  it('should return the current container state as an object', async () => {
    const containerId = 'some-container-id'

    const state = await getContainerState(containerId)
    expect(execa).toHaveBeenCalledWith('docker', [
      'inspect',
      containerId,
      '--format',
      '{{json .State}}'
    ])
    expect(state).toEqual({ Status: 'exited', ExitCode: 0 })
  })
})
