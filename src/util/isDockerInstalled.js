import which from 'which'
import Promise from 'bluebird'

async function isDockerInstalled() {
  return Promise.fromCallback((callback) => {
    which('docker', callback)
  })
    .then(() => true)
    .catch(() => false)
}

export default isDockerInstalled
