import { get } from './api';

function add(a, b) {
  return a + b;
}

it('should sum', () => {
  expect(add(1, 2)).toBe(3);
});
