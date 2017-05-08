'use strict'

module.exports = {
  increment: require('./increment'),
  computeNextVersion: require('./compute-next-version').computeNextVersion,
  getSemanticCommits: require('./compute-next-version').getSemanticCommits
}
