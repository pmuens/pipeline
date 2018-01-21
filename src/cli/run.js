/* eslint-disable no-console */

import path from 'path'
import { not, prop, flatten } from 'ramda'
import { hasFile, readConfigFile } from '../util'
import runPipeline from '../engine/runPipeline'
import db from '../util/db/db'

async function run(projectDirPath) {
  let DB
  const configFilePath = path.join(projectDirPath, '.pipeline.yml')
  const dbFilePath = path.join(projectDirPath, '.pipeline.db')
  const config = await readConfigFile(configFilePath)

  if (not(prop('pipeline', config))) {
    throw new Error(`Config file "${configFilePath}" does not contain a pipeline definition`)
  }

  console.log(`Running pipeline defined in "${configFilePath}"...`)

  const hasDbFile = await hasFile(dbFilePath)
  if (not(hasDbFile)) {
    DB = db({ filePath: dbFilePath })
    await DB.create()
  } else {
    DB = db({ filePath: dbFilePath })
  }

  const res = await runPipeline(projectDirPath, prop('pipeline', config))
  // TODO update code so that flattening of result is not necessary anymore
  const normalizedResult = flatten(res)[0]
  await DB.insert(normalizedResult)

  return normalizedResult
}

export default run
