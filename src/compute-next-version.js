const R = require('ramda')
const la = require('lazy-ass')
const is = require('check-more-types')
const increment = require('./increment')
const debug = require('debug')('next-ver')
const ggit = require('ggit')
const parseCommit = require('./parse-commit')

function addSemverInformation (commits) {
  return commits.map(parseCommit)
}

function onlySemanticCommits (commits) {
  return commits.filter(R.prop('semver'))
}

function printFoundSemanticCommits (commits) {
  debug('semantic commits')
  debug(commits)
  la(is.array(commits), 'expected list of commits', commits)
}

function printCommitsAfterTag (list) {
  debug('commits after last tag')
  debug(JSON.stringify(list, null, 2))
}

function computeChanges (version, changes) {
  debug('Current version', version)
  let newVersion = version

  for (let change of changes.reverse()) {
    newVersion = increment(newVersion, change)
  }
  return newVersion
}

function getSemanticCommits (currentVersionTag) {
  return ggit.commits.afterLastTag()
    .then(R.tap(printCommitsAfterTag))
    .then(addSemverInformation)
    .then(onlySemanticCommits)
}

function computeNextVersion (currentVersionTag) {
  la(is.unemptyString(currentVersionTag),
    'missing current version', currentVersionTag)

  const incrementVersion = computeChanges.bind(null, currentVersionTag)

  return getSemanticCommits(currentVersionTag)
    .then(R.tap(printFoundSemanticCommits))
    .then(R.map(R.prop('semver')))
    .then(R.map(R.prop('type')))
    .then(incrementVersion)
}

module.exports = {
  computeNextVersion,
  getSemanticCommits
}
