import BbPromise from 'bluebird'
import inspectContainer from './inspectContainer'
import waitForCompletion from './waitForCompletion'

jest.mock('bluebird', () => ({
  delay: jest.fn(() => Promise.resolve())
}))

jest.mock('./inspectContainer')

afterAll(() => {
  BbPromise.delay.mockRestore()
  inspectContainer.mockRestore()
})

describe('waitForCompletion()', () => {
  beforeEach(() => {
    inspectContainer.mockReset()
  })

  it('should check the container state until it has the status of "exited"', async () => {
    inspectContainer.mockImplementationOnce(() =>
      Promise.resolve({ State: { Status: 'running', Running: true } }))
    inspectContainer.mockImplementationOnce(() =>
      Promise.resolve({ State: { Status: 'exited', Running: false } }))

    const containerId = 'some-container-id'
    const timeout = 5000

    const finalState = await waitForCompletion(containerId, timeout)

    expect(BbPromise.delay).toHaveBeenCalledWith(timeout)
    expect(inspectContainer).toHaveBeenCalledWith(containerId)
    expect(finalState).toEqual({ Status: 'exited', Running: false })
  })

  it('should check the container state until it has the status of "dead"', async () => {
    inspectContainer.mockImplementationOnce(() =>
      Promise.resolve({ State: { Status: 'running', Running: true } }))
    inspectContainer.mockImplementationOnce(() =>
      Promise.resolve({ State: { Status: 'dead', Running: false } }))

    const containerId = 'some-container-id'
    const timeout = 5000

    const finalState = await waitForCompletion(containerId, timeout)

    expect(BbPromise.delay).toHaveBeenCalledWith(timeout)
    expect(inspectContainer).toHaveBeenCalledWith(containerId)
    expect(finalState).toEqual({ Status: 'dead', Running: false })
  })
})
