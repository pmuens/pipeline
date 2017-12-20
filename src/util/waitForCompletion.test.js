import BbPromise from 'bluebird'
import getContainerState from './getContainerState'
import waitForCompletion from './waitForCompletion'

jest.mock('bluebird', () => ({
  delay: jest.fn(() => Promise.resolve())
}))

jest.mock('./getContainerState')

afterAll(() => {
  BbPromise.delay.mockRestore()
  getContainerState.mockRestore()
})

describe('waitForCompletion()', () => {
  beforeEach(() => {
    getContainerState.mockReset()
  })

  it('should check the container state until it has the status of "exited"', async () => {
    getContainerState.mockImplementationOnce(() =>
      Promise.resolve({ Status: 'running', Running: true }))
    getContainerState.mockImplementationOnce(() =>
      Promise.resolve({ Status: 'exited', Running: false }))

    const containerId = 'some-container-id'
    const timeout = 5000

    const finalState = await waitForCompletion(containerId, timeout)

    expect(BbPromise.delay).toHaveBeenCalledWith(timeout)
    expect(getContainerState).toHaveBeenCalledWith(containerId)
    expect(finalState).toEqual({ Status: 'exited', Running: false })
  })

  it('should check the container state until it has the status of "dead"', async () => {
    getContainerState.mockImplementationOnce(() =>
      Promise.resolve({ Status: 'running', Running: true }))
    getContainerState.mockImplementationOnce(() =>
      Promise.resolve({ Status: 'dead', Running: false }))

    const containerId = 'some-container-id'
    const timeout = 5000

    const finalState = await waitForCompletion(containerId, timeout)

    expect(BbPromise.delay).toHaveBeenCalledWith(timeout)
    expect(getContainerState).toHaveBeenCalledWith(containerId)
    expect(finalState).toEqual({ Status: 'dead', Running: false })
  })
})
