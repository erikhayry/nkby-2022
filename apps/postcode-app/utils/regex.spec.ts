
import { removeEmptySpace } from "./regex"

test('should show welcome message', () => {
  expect(removeEmptySpace('   street  ')).toEqual('street')
})
