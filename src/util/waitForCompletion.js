import BbPromise from 'bluebird'
import getContainerState from './getContainerState'

async function waitForCompletion(containerId, timeout) {
  return BbPromise.delay(timeout)
    .then(() => getContainerState(containerId))
    .then((state) => {
      if (state.Status === 'exited' || state.Status === 'dead') {
        return state
      }
      return waitForCompletion(containerId, timeout)
    })
}

export default waitForCompletion
