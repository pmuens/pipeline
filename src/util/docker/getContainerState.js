import execa from 'execa'

async function getContainerState(containerId) {
  return execa('docker', [ 'inspect', containerId, '--format', '{{json .State}}' ]).then((res) =>
    JSON.parse(res.stdout))
}

export default getContainerState
