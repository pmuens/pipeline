import execa from 'execa'
import inspectContainer from './inspectContainer'

jest.mock('execa')

execa.mockImplementation(() =>
  Promise.resolve({
    stdout: '{ "Id": "9aee1aa5cc", "Path": "/bin/sh" }'
  }))

afterAll(() => {
  execa.mockRestore()
})

describe('inspectContainer()', () => {
  it('should return all the container information as an object', async () => {
    const containerId = 'some-container-id'

    const res = await inspectContainer(containerId)

    expect(res).toEqual({ Id: '9aee1aa5cc', Path: '/bin/sh' })
    expect(execa).toHaveBeenCalledWith('docker', [ 'inspect', '--format', '{{json .}}', containerId ])
  })
})
