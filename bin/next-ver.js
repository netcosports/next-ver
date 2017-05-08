#!/usr/bin/env node

const decideStartVersion = require('latest-version-or-tag')
const {computeNextVersion} = require('..')
const la = require('lazy-ass')
const is = require('check-more-types')
const debug = require('debug')('next-ver')
const npmUtils = require('npm-utils')

function setVersion (newVersion) {
  const args = require('minimist')(process.argv.slice(2))
  if (!args.go) {
    debug('skipping "npm version" command, because no --go option set')
    return
  }
  if (!newVersion) {
    debug('skipping "npm version" command, no new version')
    return
  }
  debug(`running "npm version %s" command`, newVersion)
  la(is.semver(newVersion), 'invalid new version', newVersion)

  return npmUtils.incrementVersion({
    increment: newVersion
  })
}

function printVersion (nextVersion) {
  if (!nextVersion) {
    console.log('no new version judging by commits')
    return
  }
  console.log('next version should be', nextVersion)
}

decideStartVersion()
  .then(computeNextVersion)
  .then(printVersion)
  .then(setVersion)
  .done()
