import path from 'path'
import fse from 'fs-extra'
import Promise from 'bluebird'

const fsp = Promise.promisifyAll(fse)

async function hasGitRepository(dirPath) {
  return fsp.pathExistsAsync(path.join(dirPath, '.git')).then((exists) => exists)
}

export default hasGitRepository
