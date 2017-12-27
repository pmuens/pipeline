import execa from 'execa'
import getContainerLogs from './getContainerLogs'

jest.mock('execa')

afterAll(() => {
  execa.mockRestore()
})

describe('getContainerLogs()', () => {
  const containerId = 'some-container-id'

  beforeEach(() => {
    execa.mockReset()
  })

  it('should return a sorted array with log objects', async () => {
    execa.mockImplementation(() =>
      Promise.resolve({
        stdout:
          '1970-01-03T20:12:15.790078302Z some stdout logs 1\n1970-01-01T20:12:15.790078302Z some stdout logs 2',
        stderr:
          '1970-01-02T20:12:15.790078302Z some stderr logs 1\n1970-01-04T20:12:15.790078302Z some stderr logs 2'
      }))

    const logs = await getContainerLogs(containerId)

    expect(logs).toEqual([
      { timestamp: new Date('1970-01-01T20:12:15.790078302Z'), message: 'some stdout logs 2' },
      { timestamp: new Date('1970-01-02T20:12:15.790078302Z'), message: 'some stderr logs 1' },
      { timestamp: new Date('1970-01-03T20:12:15.790078302Z'), message: 'some stdout logs 1' },
      { timestamp: new Date('1970-01-04T20:12:15.790078302Z'), message: 'some stderr logs 2' }
    ])
    expect(execa).toHaveBeenCalledWith('docker', [ 'logs', '--timestamps', containerId ])
  })

  it('should be able to deal with different whitespace usages in stdout and stderr entries', async () => {
    execa.mockImplementation(() =>
      Promise.resolve({
        stdout: ' \n\n ',
        stderr:
          '1970-01-02T20:12:15.790078302Z some stderr logs 1 \n 1970-01-04T20:12:15.790078302Z some stderr logs 2\n'
      }))

    const logs = await getContainerLogs(containerId)

    expect(logs).toEqual([
      { timestamp: new Date('1970-01-02T20:12:15.790078302Z'), message: 'some stderr logs 1' },
      { timestamp: new Date('1970-01-04T20:12:15.790078302Z'), message: 'some stderr logs 2' }
    ])
    expect(execa).toHaveBeenCalledWith('docker', [ 'logs', '--timestamps', containerId ])
  })
})
