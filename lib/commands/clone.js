var Git = require('nodegit');
var path = require('path');
var _ = require('lodash');
var fs = require('fs');
var Promise = require('bluebird');

module.exports = (function(){
  return new CloneCommand();
})();

module.exports.CloneCommand = CloneCommand;

function CloneCommand() {
  this.usage = 'Usage: $0 clone <repo> [dir]';
  this.options = {

  };
}

CloneCommand.prototype.validate = function(args, rapido) {
  var repo = args._[0];
  var dir = args._[1];
  if(!repo){
    throw 'repo name or url is required';
  }

  if(!dir) {
      dir = process.cwd();
  }

  return {
    repo: repo,
    dir: dir
  };
};

CloneCommand.prototype.run = function(args, config, rapido) {
  var cloneOptions = new Git.CloneOptions();
  var repoNameRegex = /.*\/(.*)\.git$/g;
  var repoName = repoNameRegex.exec(args.repo)[1];
  Git.Clone.clone(args.repo, args.dir).then(function(repository){
      var closestConfig = rapido.findClosestConfig();

      var dependencies = config.dependencies || [];
      dependencies.push({

      })
      rapido.updateConfig(closestConfig, )
      rapido.log.success("Cloned " + args.repo);
  })
  .catch(function(error) {
      rapido.log.error('Failed to clone repo ' + args.repo + ': ' + error);
  });
};
