import path from 'path'
import fs from 'fs'
import Promise from 'bluebird'

const fsp = Promise.promisifyAll(fs)

async function writeDockerfile(dirPath, projectName, image) {
  const fileContent = [
    `FROM ${image}`,
    '',
    'RUN mkdir -p /usr/src/app',
    'RUN WORKDIR /usr/src/app',
    '',
    'ONBUILD COPY . /usr/src/app',
    '',
    // TODO remove this hardcoded entrypoint later on?!
    'ENTRYPOINT ["/bin/sh"]',
    ''
  ].join('\n')

  const dockerfilePath = path.join(dirPath, `${projectName}.dockerfile`)
  await fsp.writeFileAsync(dockerfilePath, fileContent, 'utf8')
}

export default writeDockerfile
