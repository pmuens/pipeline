import path from 'path'

function isValidConfigFile(filePath) {
  const fileName = filePath
    .split(path.sep)
    .slice(-1)
    .pop()

  if (fileName === '.pipeline.yml') {
    return true
  }
  return false
}

export default isValidConfigFile
