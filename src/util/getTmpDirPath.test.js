import getTmpDirPath from './getTmpDirPath'

describe('getTmpDirPath()', () => {
  it('should return a namespaced tmp directory', () => {
    const tmpDir = getTmpDirPath()

    expect(tmpDir).toMatch(/.+tmpdirs-pipelines.+/)
  })
})
