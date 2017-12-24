import execa from 'execa'
import getContainerLogs from './getContainerLogs'

jest.mock('execa')

execa.mockImplementation(() =>
  Promise.resolve({
    stdout:
      '1970-01-03T20:12:15.790078302Z some stdout logs 1\n1970-01-01T20:12:15.790078302Z some stdout logs 2',
    stderr:
      '1970-01-02T20:12:15.790078302Z some stderr logs 1\n1970-01-04T20:12:15.790078302Z some stderr logs 2'
  }))

afterAll(() => {
  execa.mockRestore()
})

describe('getContainerLogs()', () => {
  it('should return a sorted array with log objects', async () => {
    const containerId = 'some-container-id'

    const logs = await getContainerLogs(containerId)

    expect(logs).toEqual([
      { timestamp: new Date('1970-01-01T20:12:15.790078302Z'), message: 'some stdout logs 2' },
      { timestamp: new Date('1970-01-02T20:12:15.790078302Z'), message: 'some stderr logs 1' },
      { timestamp: new Date('1970-01-03T20:12:15.790078302Z'), message: 'some stdout logs 1' },
      { timestamp: new Date('1970-01-04T20:12:15.790078302Z'), message: 'some stderr logs 2' }
    ])
    expect(execa).toHaveBeenCalledWith('docker', [ 'logs', '--timestamps', containerId ])
  })
})
