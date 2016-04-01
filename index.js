#!/usr/bin/env node

var url = require('url')

var _ = require('lodash')
var emoji = require('node-emoji')
var hideSecrets = require('hide-secrets')
var request = require('request')
var nopt = require('nopt')
var log = require('npmlog')

var rc = require('./lib/rc')
var pkg = require('./package.json')

var rcFlags = rc.get()

var cliFlags = nopt({
  api: String,
  loglevel: [
    'silly',
    'verbose',
    'info',
    'http',
    'warn',
    'error',
    'silent'
  ]
}, {
  s: ['--loglevel', 'silent'],
  d: ['--loglevel', 'info'],
  dd: ['--loglevel', 'verbose'],
  ddd: ['--loglevel', 'silly'],
  silent: ['--loglevel', 'silent'],
  verbose: ['--loglevel', 'verbose'],
  quiet: ['--loglevel', 'warn']
})

var flags = _.assign({}, rcFlags, cliFlags)

log.levels.http = 1500

log.level = flags.loglevel || 'info'
log.headingStyle = {fg: 'white'}
log.heading = process.platform === 'darwin' ? emoji.get('palm_tree') + ' ' : ''

flags.api = url.parse(flags.api || 'https://api.greenkeeper.io/').format()

log.silly('cli', 'rc arguments', _.omit(hideSecrets(rcFlags), 'argv'))
log.silly('cli', 'cli arguments', _.omit(hideSecrets(cliFlags), 'argv'))
log.verbose('cli', 'arguments', _.omit(hideSecrets(flags), 'argv'))

if (flags.version) {
  console.log(pkg.version || 'development')
  process.exit(0)
}

var packageName = process.env['npm_package_name']
var packageVersion = process.env['npm_package_version']

if (!packageName || !packageVersion) {
  log.error('postpublish', 'Please add this command to your package.json.')
  log.error('postpublish', 'Like so: "scripts": [{"postpublish": "greenkeeper-postpublish"}]')
  log.error('postpublish', 'Make sure it is listed in the devDependencies as well.')
  process.exit(1)
}

log.http('postpublish', 'Sending request')
request({
  method: 'POST',
  url: flags.api + 'webhooks/npm',
  json: true,
  body: {
    name: packageName,
    version: packageVersion
  }
}, function (err, res, data) {
  if (err) {
    log.error('postpublish', err.message)
    process.exit(2)
  }

  if (data.ok) {
    return console.log('Announced', packageName, packageVersion, 'to Greenkeeper')
  }

  log.error('postpublish',
    res.statusCode + ' ' +
    res.statusMessage +
    (res.body.message ? ': ' + res.body.message : '')
  )
})
