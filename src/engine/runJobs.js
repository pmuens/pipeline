import BbPromise from 'bluebird'
import runJob from './runJob'

async function runJobs(projectDirPath, images, commands, parallelJobs = 2) {
  return BbPromise.map(images, (image) => runJob(projectDirPath, image, commands), {
    concurrency: parallelJobs
  })
}

export default runJobs
