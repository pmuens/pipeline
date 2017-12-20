import BbPromise from 'bluebird'
import inspectContainer from './inspectContainer'

async function waitForCompletion(containerId, timeout) {
  return BbPromise.delay(timeout)
    .then(() => inspectContainer(containerId))
    .then((res) => {
      if (res.State.Status === 'exited' || res.State.Status === 'dead') {
        return res.State
      }
      return waitForCompletion(containerId, timeout)
    })
}

export default waitForCompletion
