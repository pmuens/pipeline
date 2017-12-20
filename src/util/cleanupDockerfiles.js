import path from 'path'
import fse from 'fs-extra'
import { append } from 'ramda'
import BbPromise from 'bluebird'

const fsp = BbPromise.promisifyAll(fse)

async function cleanupDockerfiles(dirPath) {
  const dockerfileRegex = new RegExp('.pipeline.*.dockerfile', 'i')

  const files = await fsp.readdirAsync(dirPath)

  return BbPromise.reduce(
    files,
    (acc, file) => {
      if (file.match(dockerfileRegex)) {
        const filePath = path.join(dirPath, file)
        return fsp.removeAsync(filePath).then(() => append(file, acc))
      }
      return acc
    },
    []
  )
}

export default cleanupDockerfiles
