import execa from 'execa'
import runContainer from './runContainer'

jest.mock('execa', () => ({
  shell: jest.fn(() => Promise.resolve({ stdout: 'some-container-id' }))
}))

afterAll(() => {
  execa.shell.mockRestore()
})

describe('runContainer()', () => {
  it('should run a container and return the contaier id', async () => {
    const commands = [ 'echo hello', 'echo world' ]
    const containerName = 'pipeline/some-project/busybox'

    const containerId = await runContainer(containerName, commands)
    const shellCommand = `docker run --detach ${containerName} /bin/sh -c "set -e;echo hello;echo world"`

    expect(execa.shell).toHaveBeenCalledWith(shellCommand)
    expect(containerId).toEqual('some-container-id')
  })
})
