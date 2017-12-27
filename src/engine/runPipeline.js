import BbPromise from 'bluebird'
import { prop, map, not } from 'ramda'
import runJobs from './runJobs'

async function runPipeline(projectDirPath, pipelineDefinition) {
  return BbPromise.mapSeries(pipelineDefinition, (step) => {
    const images = prop('images', step)
    const commands = prop('commands', step)
    return runJobs(projectDirPath, images, commands).then((jobResults) =>
      map((jobResult) => {
        const id = prop('id', jobResult)
        const exitCode = prop('exitCode', jobResult)
        if (not(exitCode === 0)) {
          throw new Error(`Job with id "${id}" returned exit code ${exitCode}`)
        }
        return jobResult
      }, jobResults))
  })
}

export default runPipeline
