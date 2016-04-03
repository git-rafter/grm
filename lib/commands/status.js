var path = require('path');
var _ = require('lodash');
var Promise = require('bluebird');

module.exports = (function(){
  return new StatusCommand();
})();

module.exports.StatusCommand = StatusCommand;

function StatusCommand() {
  this.usage = 'Usage: $0 status';
  this.options = {

  };
}

StatusCommand.prototype.validate = function(args, rapido) {
  return args;
};

StatusCommand.prototype.run = function(args, config, rapido) {
  rapido.log.success('Command runs: status');
};
