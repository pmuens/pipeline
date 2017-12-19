import execa from 'execa'
import { flatten, append } from 'ramda'

async function runContainer(containerName, commands) {
  // always use "set -e" to fail loudly
  let preparedCommands = append('set -e', [])
  preparedCommands = append(commands, preparedCommands)
  preparedCommands = flatten(preparedCommands)
  preparedCommands = preparedCommands.join(';')

  // TODO using "-c" is shell specific. We should update this to support other shells
  return execa
    .shell(`docker run --detach ${containerName} /bin/sh -c "${preparedCommands}"`)
    .then((res) => res.stdout)
}

export default runContainer
