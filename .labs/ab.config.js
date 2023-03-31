/** @type {import('../../../lib/utils/schema').Experiment} */
module.exports = {
  name: 'Experiment 1',
  id: 'abcd1234',
  variants: [
    {
      name: 'Original',
      id: 0,
    },
    {
      name: 'Variant 1',
      id: 1,
    },
  ],
  development: {
    running: 'on',
    weights: [0, 100],
  },
  test: {
    running: 'on',
    weights: [0, 100],
  },
};
