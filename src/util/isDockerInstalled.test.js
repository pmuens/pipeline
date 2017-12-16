import which from 'which'
import isDockerInstalled from './isDockerInstalled'

jest.mock('which')

which.mockImplementationOnce((cmd, cb) => cb(null, 'path-to-bin'))
which.mockImplementationOnce((cmd, cb) => cb(new Error('not found'), null))

afterAll(() => {
  which.mockRestore()
})

describe('isDockerInstalled()', () => {
  it('should detect if Docker is installed', async () => {
    const res = await isDockerInstalled()

    expect(which).toHaveBeenCalled()
    expect(res).toEqual(true)
  })

  it('should return false if Docker is not installed', async () => {
    const res = await isDockerInstalled()

    expect(which).toHaveBeenCalled()
    expect(res).toEqual(false)
  })
})
