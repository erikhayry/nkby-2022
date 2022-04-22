
import { removeEmptySpace } from './regex'

describe('removeEmptySpace', () => {
  test('should remove empty spaces', () => {
    expect(removeEmptySpace('   street  ')).toEqual('street')
    expect(removeEmptySpace('\r\nstreet  ')).toEqual('street')
    expect(removeEmptySpace('\tstreet\t')).toEqual('street')
  })
})
