var path = require('path');
var _ = require('lodash');
var Promise = require('bluebird');

module.exports = (function(){
  return new CloneCommand();
})();

module.exports.CloneCommand = CloneCommand;

function CloneCommand() {
  this.usage = 'Usage: $0 clone <repo>';
  this.options = {

  };
}

CloneCommand.prototype.validate = function(args, rapido) {
  var repo = args._[0];
  if(!repo){
    throw 'repo name or url is required';
  }

  return {
    repo: repo
  };
};

CloneCommand.prototype.run = function(args, config, rapido) {
  rapido.log.success('Command runs: clone');
};
