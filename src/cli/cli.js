import path from 'path'
import { not, contains } from 'ramda'
import { hasDirectory, hasFile } from '../util'
import * as commands from './index'

async function cli(command, projectDirPath = process.cwd()) {
  const resolvedPath = path.resolve(projectDirPath)

  const validCommands = [ 'setup', 'run', 'builds', 'logs' ]
  if (not(contains(command, validCommands))) {
    throw new Error(`${command} is not a valid command`)
  }

  const isConfigFilePresent = await hasFile(path.join(projectDirPath, '.pipeline.yml'))
  const isGitRepositoryPresent = await hasDirectory(path.join(projectDirPath, '.git'))

  if (not(isConfigFilePresent)) {
    throw new Error(`.pipeline.yml config file not found in "${projectDirPath}"`)
  }
  if (not(isGitRepositoryPresent)) {
    throw new Error(`.git repository not found in "${projectDirPath}"`)
  }

  await commands[command](resolvedPath)
}

export default cli
