import os from 'os'
import path from 'path'
import crypto from 'crypto'

function getTmpDirPath() {
  return path.join(os.tmpdir(), 'tmpdirs-pipeline', crypto.randomBytes(8).toString('hex'))
}

export default getTmpDirPath
