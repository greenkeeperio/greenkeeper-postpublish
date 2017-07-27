#!/usr/bin/env node

var fs = require('fs')
var path = require('path')

var emoji = require('node-emoji')
var flags = require('@greenkeeper/flags')
var request = require('request')
var log = require('npmlog')

var pkg = require('./package.json')

log.levels.http = 1500

log.level = flags.loglevel || 'info'
log.headingStyle = {fg: 'white'}
log.heading = process.platform === 'darwin' ? emoji.get('palm_tree') + ' ' : ''

if (flags.version) {
  console.log(pkg.version || 'development')
  process.exit(0)
}

var packageName = flags.pkgname || process.env['npm_package_name']
var packageVersion = flags.pkgversion || process.env['npm_package_version']

if (!packageName || !packageVersion) {
  var currentPackage
  try {
    currentPackage = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json')))
  } catch (e) {
    currentPackage = {}
  }

  if (!currentPackage.name || !currentPackage.version) {
    log.error('postpublish', 'Please add this command to your package.json.')
    log.error('postpublish', 'Like so: "scripts": [{"postpublish": "greenkeeper-postpublish"}]')
    log.error('postpublish', 'Make sure it is listed in the devDependencies as well.')
    log.error('postpublish', 'Alternatively specify the --pkgname and --pkgversion flags.')
    process.exit(1)
  }
  packageName = currentPackage.name
  packageVersion = currentPackage.version
}
log.info('postpublish', 'Use ' + packageName + '@' + packageVersion)
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

  if (data && data.ok) {
    return console.log('Announced', packageName + '@' + packageVersion, 'to Greenkeeper')
  }

  log.error('postpublish',
    res.statusCode + ' ' +
    res.statusMessage +
    (res.body.message ? ': ' + res.body.message : '')
  )
})
