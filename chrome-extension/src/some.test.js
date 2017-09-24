import fpget from "lodash/fp/get";

function add(a, b) {

  return a + b;
}

it('should sum', () => {
  let val = {a : [{b: 1}, {b:2}, {b:3}]};
  console.log(fpget("a.$.b", val))
  expect(add(1, 2)).toBe(3);
});
