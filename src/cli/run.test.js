import path from 'path'
import fse from 'fs-extra'
import BbPromise from 'bluebird'
import yaml from 'js-yaml'
import getTmpDirPath from '../util/getTmpDirPath'
import runPipeline from '../engine/runPipeline'
import run from './run'

const fsp = BbPromise.promisifyAll(fse)

jest.mock('../engine/runPipeline')

runPipeline.mockImplementation(() => Promise.resolve([[[{ some: 'result' }]]]))

afterAll(() => {
  runPipeline.mockRestore()
})

describe('run()', () => {
  let tmpDir
  let gitDirPath
  let configFilePath
  let dbFilePath

  const configAsJson = {
    pipeline: [
      {
        name: 'greet',
        images: [ 'busybox' ],
        commands: [ 'echo hello', 'echo world' ]
      }
    ]
  }
  const pipelineFileContent = yaml.safeDump(configAsJson)

  beforeEach(async () => {
    tmpDir = getTmpDirPath()
    await fsp.ensureDirAsync(tmpDir)
    gitDirPath = path.join(tmpDir, '.git')
    await fsp.ensureDirAsync(gitDirPath)
    configFilePath = path.join(tmpDir, '.pipeline.yml')
    dbFilePath = path.join(tmpDir, '.pipeline.db')
  })

  it('should throw if no pipeline is defined in config file', async () => {
    await fsp.writeFileAsync(configFilePath, '')
    await expect(run(tmpDir)).rejects.toThrow('not contain a pipeline definition')
  })

  it('should run the pipeline in the config file and store the result in the DB', async () => {
    await fsp.writeFileAsync(configFilePath, pipelineFileContent)

    await run(tmpDir)

    const dbContent = await fsp.readFileAsync(dbFilePath)
    const parsedDbContent = JSON.parse(dbContent)

    expect(parsedDbContent).toEqual([{ some: 'result' }])
  })
})
