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

function printResult (nextVersion) {
  if (!nextVersion) {
    console.log('no new version judging by commits')
    return
  }
  console.log('next version should be', nextVersion)
}

function printFoundSemanticCommits (commits) {
  debug('semantic commits')
  debug(commits)
  la(is.array(commits), 'expected list of commits', commits)
}

function printChange (feat) {
  debug('semantic change "%s"', feat)
  la(is.maybe.string(feat), 'expected change to be a string', feat)
}

function printCommitsAfterTag (list) {
  debug('commits after last tag')
  debug(JSON.stringify(list, null, 2))
}

function computeChanges(version, changes) {
  let new_version = version;

  for (change of changes.reverse()) {
    new_version = increment(new_version, change)
  }
  return new_version;
}

function computeNextVersion (currentVersionTag) {
  la(is.unemptyString(currentVersionTag),
    'missing current version', currentVersionTag)

  const incrementVersion = computeChanges.bind(null, currentVersionTag)

  return ggit.commits.afterLastTag()
    .then(R.tap(printCommitsAfterTag))
    .then(addSemverInformation)
    .then(onlySemanticCommits)
    .then(R.tap(printFoundSemanticCommits))
    .then(R.map(R.prop('semver')))
    .then(R.map(R.prop('type')))
    .then(incrementVersion)
    .then(R.tap(printResult))
}

module.exports = computeNextVersion
