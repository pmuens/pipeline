import execa from 'execa'

async function getContainerLogs(containerId) {
  return execa('docker', [ 'logs', containerId ]).then((res) => res.stdout)
}

export default getContainerLogs
