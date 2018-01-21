import path from 'path'
import fse from 'fs-extra'
import BbPromise from 'bluebird'
import getTmpDirPath from '../util/getTmpDirPath'
import cli from './cli'
import run from './run'

const fsp = BbPromise.promisifyAll(fse)

jest.mock('./run')

run.mockImplementation(() => Promise.resolve())

afterAll(() => {
  run.mockRestore()
})

describe('cli()', () => {
  let tmpDir
  let gitDirPath
  let configFilePath

  beforeEach(async () => {
    tmpDir = getTmpDirPath()
    await fsp.ensureDirAsync(tmpDir)
    gitDirPath = path.join(tmpDir, '.git')
    await fsp.ensureDirAsync(gitDirPath)
    configFilePath = path.join(tmpDir, '.pipeline.yml')
    await fsp.writeFileAsync(configFilePath, 'pipeline: []')
  })

  it('should throw if the directory does not contain a Pipeline config file', async () => {
    await fsp.removeAsync(configFilePath)
    await expect(cli('run', tmpDir)).rejects.toThrow('config file not found')
  })

  it('should throw if the directory does not contain a .git repository', async () => {
    await fsp.removeAsync(gitDirPath)
    await expect(cli('run', tmpDir)).rejects.toThrow('.git repository not found')
  })

  it('should throw if command is invalid', async () => {
    await expect(cli('invalidCommand')).rejects.toThrow('not a valid command')
  })

  it('should run a valid command', async () => {
    await cli('run', tmpDir)
    expect(run).toHaveBeenCalled()
  })
})
