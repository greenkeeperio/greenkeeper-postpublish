#!/usr/bin/env node

var fs = require('fs')
var path = require('path')
var crypto = require('crypto')

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
var installation = flags.installation || process.env['gh_installation']
var gkSecret = flags.secret || process.env['gk_secret']

if (!installation) {
  log.error('postpublish', 'environment variable `gh_installation` or argument --installation missing')
}

if (!gkSecret) {
  log.error('postpublish', 'environment variable `gk_secret` or argument --secret missing')
}

if (!installation || !gkSecret) {
  process.exit(1)
}

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
    process.exit(2)
  }
  packageName = currentPackage.name
  packageVersion = currentPackage.version
}

log.info('postpublish', 'Use ' + packageName + '@' + packageVersion)
log.http('postpublish', 'Sending request')

const versions = {}
versions[packageVersion] = {}
const body = {
  payload: {
    name: packageName,
    'dist-tags': {
      latest: packageVersion
    },
    versions: versions
  }
}

const secret = crypto.createHmac('sha256', gkSecret)
  .update(installation)
  .digest('hex')

const hmacPayload = crypto.createHmac('sha256', secret)
  .update(JSON.stringify(body))
  .digest('hex')

request({
  method: 'POST',
  url: `${flags.api}npm/${installation}`,
  json: true,
  body: body,
  headers: {
    'x-npm-signature': `sha256=${hmacPayload}`
  }
}, function (err, res, data) {
  if (err) {
    log.error('postpublish', err.message)
    process.exit(3)
  }

  if (data && data.ok) {
    return console.log('Announced', packageName + '@' + packageVersion, 'to Greenkeeper')
  }

  let errorMessage = ''
  if (!res.statusCode || !res.statusMessage || !res.body) {
    errorMessage = JSON.stringify(res) + '\n' + JSON.stringify(data)
  } else {
    errorMessage = res.statusCode + ' ' +
      res.statusMessage +
      (res.body.message ? ': ' + res.body.message : '')
  }

  log.error('postpublish', errorMessage)
})
