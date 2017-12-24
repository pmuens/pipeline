import execa from 'execa'
import { union, ascend, prop, sortWith, map } from 'ramda'

// TODO refactor this code to use less in-memory operations
async function getContainerLogs(containerId) {
  return execa('docker', [ 'logs', '--timestamps', containerId ]).then((res) => {
    const { stderr, stdout } = res

    const output = union(stdout.split('\n'), stderr.split('\n'))

    const logs = map((log) => {
      const matchRes = log.match(/(.+Z )(.*)/)
      return {
        timestamp: new Date(matchRes[1].trim()), // remove space between timestamp and message
        message: matchRes[2]
      }
    }, output)

    const sorter = sortWith([ ascend(prop('timestamp')) ])
    return sorter(logs)
  })
}

export default getContainerLogs
