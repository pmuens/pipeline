import path from 'path'
import isValidConfigFile from './isValidConfigFile'

describe('isValidConfigFile()', () => {
  it('should detect .pipelines.yml file', () => {
    const filePath = path.join('some', 'path', '.pipelines.yml')
    const res = isValidConfigFile(filePath)

    expect(res).toEqual(true)
  })

  it('should return false if file is invalid', () => {
    const filePath = path.join('some', 'path', '.pipelines.foo')
    const res = isValidConfigFile(filePath)

    expect(res).toEqual(false)
  })
})
