#!/usr/bin/env node --harmony

var program = require('commander'),
  co = require('co'),
  prompt = require('co-prompt'),
  request = require('superagent'),
  fs = require('fs'),
  path = require('path'),
  chalk = require('chalk'),
  Promise = require('bluebird'),
  listServices = require('./list-services');
require('console.table');

function parseBool(val) {
  return new Boolean(val);
}

program
  .option('-u --update', 'Updates the list of available repos')
  .option('-v --verbose', 'Includes more detailed info about the repos')
  .description('Lists the available repos and their status')
  .parse(process.argv);

var action = (program.update ? udpate : list);

action(program)
  .then(function(){
    process.exit(0);
  }).catch(function(err) {
    console.error(chalk.red(err));
    process.exit(1);
  });;

function list(program){
  return listServices.list(program.verbose)
    .then(function(data){
      if(data){
        console.table(data);
      } else {
        throw new Error('Failed to read gdm.json file');
      }
    });
}

function update(program){
  return co(function* (){

  });
}
