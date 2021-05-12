#!/usr/bin/env node

const { existsSync } = require('fs')
const { join } = require('path')
const yParser = require('yargs-parser')
const chalk = require('chalk')
const signale = require('signale')
const updater = require('update-notifier')
const builder = require('../index')

// print version and @local
const args = yParser(process.argv.slice(2))
if (args.v || args.version) {
  console.log(require('../package').version)
  if (existsSync(join(__dirname, '../.local'))) {
    console.log(chalk.cyan('@local'))
  }
  process.exit(0)
}

// Notify update when process exits
const pkg = require('../package.json')
updater({ pkg }).notify({ defer: true })

builder.run(args).catch(e => {
  signale.error(e)
  process.exit(1)
})
