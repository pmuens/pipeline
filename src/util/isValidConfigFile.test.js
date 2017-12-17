import path from 'path'
import isValidConfigFile from './isValidConfigFile'

describe('isValidConfigFile()', () => {
  it('should detect .pipeline.yml file', () => {
    const filePath = path.join('some', 'path', '.pipeline.yml')
    const res = isValidConfigFile(filePath)

    expect(res).toEqual(true)
  })

  it('should return false if file is invalid', () => {
    const filePath = path.join('some', 'path', '.pipeline.foo')
    const res = isValidConfigFile(filePath)

    expect(res).toEqual(false)
  })
})
