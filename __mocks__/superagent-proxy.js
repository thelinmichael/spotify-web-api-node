function setup(superagent) {
  superagent.proxy = jest.fn();
  return superagent;
}

module.exports = setup;
