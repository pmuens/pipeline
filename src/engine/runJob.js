import { v4 } from 'uuid'
import {
  writeDockerfile,
  buildContainer,
  runContainer,
  waitForCompletion,
  getContainerLogs,
  inspectContainer,
  cleanupDockerfiles
} from '../util/docker'

async function runJob(projectDirPath, image, commands) {
  const id = v4()
  const startedAt = new Date()

  const dockerfilePath = await writeDockerfile(projectDirPath, image)
  const containerName = await buildContainer(projectDirPath, dockerfilePath)
  const containerId = await runContainer(containerName, commands)

  await waitForCompletion(containerId, 2500)

  const logs = await getContainerLogs(containerId)
  const containerInfo = await inspectContainer(containerId)
  const exitCode = containerInfo.State.ExitCode

  await cleanupDockerfiles(projectDirPath)

  const finishedAt = new Date()

  return {
    id,
    containerId,
    containerName,
    image,
    projectDirPath,
    exitCode,
    logs,
    startedAt,
    finishedAt
  }
}

export default runJob
