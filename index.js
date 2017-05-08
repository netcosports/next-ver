const decideStartVersion = require('latest-version-or-tag')
const {computeNextVersion, getSemanticCommits} = require('./src/index')

module.exports = {
  decideStartVersion,
  getSemanticCommits,
  computeNextVersion
}
