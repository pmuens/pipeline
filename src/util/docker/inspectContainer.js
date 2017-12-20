import execa from 'execa'

async function inspectContainer(containerId) {
  return execa('docker', [ 'inspect', '--format', '{{json .}}', containerId ]).then((res) =>
    JSON.parse(res.stdout))
}

export default inspectContainer
