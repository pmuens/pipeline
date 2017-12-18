import path from 'path'
import fs from 'fs'
import Promise from 'bluebird'
import execa from 'execa'

const fsp = Promise.promisifyAll(fs)

async function buildContainer(dockerfilePath, projectDirPath) {
  const projectName = projectDirPath
    .split(path.sep)
    .slice(-1)
    .pop()
  const dockerfileContent = await fsp.readFileAsync(dockerfilePath, 'utf8')

  // this splits the Dockerfile at its newlines and uses the first entry
  // to extract the iamge name
  const image = dockerfileContent.split('\n')[0].replace('FROM ', '')

  return execa('docker', [
    'build',
    '--tag',
    `pipeline/${projectName}/${image}`,
    '--file',
    dockerfilePath,
    projectDirPath
  ])
}

export default buildContainer
