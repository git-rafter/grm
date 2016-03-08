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
  .option('-m --init-module <module>', 'Third-party init module to use.')
  .description('Initializes the project based on the group repo list')
  .parse(process.argv);

if (!program.rejectUnauthorized) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

var gdmFile = path.join(process.cwd(), 'gdm.json');
var lstat = Promise.promisify(fs.lstat);
lstat(gdmFile)
  .then(function(data){
    console.error(chalk.red('Project already initialized. See gdm.json'));
    process.exit(1);
  })
  .catch(function(err){
      var action = (program.args.length ? service : project);

      action(program)
        .then(function(data){
          if(data){
            var writeFile = Promise.promisify(fs.writeFile);
            return writeFile(gdmFile, JSON.stringify(data, null, 4));
          } else {
            console.error(chalk.red('Error generating gdm.json file'));
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
    var url = yield prompt('Git Repo [github.com]: ');
    var group = yield prompt('Org/Group Name []: ');
    var seed_repo = yield prompt('Seed Repo []: ');
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
      return require(program.initModule).project(props);
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
        return require(initModule).service(config);
      });
  });
}

function _getInitModule(url){
  return (url.includes('gitlab') ? './gdm-init-gitlab' : './gdm-init-github');
}
