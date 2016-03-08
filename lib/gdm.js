#!/usr/bin/env node

var program = require('commander');
program
    .version('0.0.1')
    .command('init [service]', 'initializes the root project directory')
    .command('sync [name]', 'synchronizes with central repository')
    .command('install [repo] [options]', 'installs a git repo to the root project')
    .command('uninstall [name]', 'uninstalls a git repo from the root project')
    .command('list', 'lists projects')
    .parse(process.argv);
