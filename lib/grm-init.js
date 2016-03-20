#!/usr/bin/env node --harmony

var program = require('commander'),
  co = require('co'),
  prompt = require('co-prompt'),
  request = require('superagent'),
  fs = require('fs'),
  path = require('path'),
  chalk = require('chalk'),
  Promise = require('bluebird');

program
  .option('--no-reject-unauthorized', 'Disables CA authorization verification')
  .option('-m --grm-module <module>', 'Third-party init module to use.')
  .option('-r --git-repo <url>', 'Git Repository base URL')
  .option('-g --group <group>', 'Git Repo Group/Org Name/Id')
  .option('-s --seed <seed>', 'Git seed repo URL')
  .option('-y --yes', 'Uses defaults for all settings not specified through options')
  .description('Initializes the project based on the group repo list')
  .parse(process.argv);

if (!program.rejectUnauthorized) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

var grmFile = path.join(process.cwd(), 'grm.json');
var lstat = Promise.promisify(fs.lstat);
lstat(grmFile)
  .then(function(data){
    console.error(chalk.red('Project already initialized. See grm.json'));
    process.exit(1);
  })
  .catch(function(err){
      var action = project;

      action(program)
        .then(function(data){
          if(data){
            var writeFile = Promise.promisify(fs.writeFile);
            return writeFile(grmFile, JSON.stringify(data, null, 4));
          } else {
            console.error(chalk.red('Error generating grm.json file'));
            process.exit(1);
          }
        }).then(function(){
          process.exit(0);
        }).catch(function(err) {
          console.error(chalk.red(err));
          process.exit(1);
        });
  });

function project(program){
  return co(function* (){
    var url = program.gitRepo || (!program.yes ? (yield prompt('Git Repo [github.com]: ')) : undefined);
    var group = program.group || (!program.yes ? (yield prompt('Org/Group Name []: ')) : undefined);
    var seed_repo = program.seed || (!program.yes ? (yield prompt('Seed Repo []: ')) : undefined);
    var props = {
      dependencies: {}
    };
    props.repo_url = url || 'github.com';
    props.group = group;

    if(seed_repo){
      props.seed_repo = seed_repo;
    }

    if(group){
      if(!program.initModule) {
        program.initModule = _getInitModule(props.repo_url);
      }

      return require(program.initModule).initProject(props);
    }
    else {
      return props;
    }
  });
}

function service(program){
  return co(function* (){
    return require('./config')()
      .then(function(config){
        var initModule = _getInitModule(config.repo_url);
        return require(initModule).initService(config);
      });
  });
}

function _getInitModule(url){
  return (url.includes('gitlab') ? './grm-init-gitlab' : './grm-init-github');
}
