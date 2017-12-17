import fs from 'fs'
import path from 'path'
import Promise from 'bluebird'
import yaml from 'js-yaml'
import isValidConfigFile from './isValidConfigFile'

const fsp = Promise.promisifyAll(fs)

async function readConfigFile(filePath) {
  const fileName = filePath
    .split(path.sep)
    .slice(-1)
    .pop()

  if (!isValidConfigFile(filePath)) {
    throw new Error(`The provided config file "${fileName}" is not a Pipeline config`)
  }

  const fileContent = await fsp.readFileAsync(filePath)
  return yaml.safeLoad(fileContent)
}

export default readConfigFile
