import execa from 'execa'
import isDockerRunning from './isDockerRunning'

jest.mock('execa')

execa.mockImplementationOnce(() => Promise.resolve())
execa.mockImplementationOnce(() => Promise.reject())

afterAll(() => {
  execa.mockRestore()
})

describe('isDockerRunning()', () => {
  it('should detect if Docker is running', async () => {
    const res = await isDockerRunning()

    expect(execa).toHaveBeenCalledWith('docker', [ 'version' ])
    expect(res).toEqual(true)
  })

  it('should return false if Docker is not running', async () => {
    const res = await isDockerRunning()

    expect(execa).toHaveBeenCalledWith('docker', [ 'version' ])
    expect(res).toEqual(false)
  })
})
