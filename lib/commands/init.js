var path = require('path');
var _ = require('lodash');
var Promise = require('bluebird');

module.exports = (function(){
  return new InitCommand();
})();

module.exports.InitCommand = InitCommand;

function InitCommand() {
  this.usage = 'Usage: $0 init';
  this.options = {
    'yes': {
      description: 'Accept default values',
      alias: 'y'
    }
  };
}

InitCommand.prototype.validate = function(args, rapido) {
  if(args._.length > 0){
    throw 'Unexpected command line arguement';
  }

  return {
    yes: args.yes
  };
};

InitCommand.prototype.run = function(args, config, rapido) {
  var self = this;
  return new Promise(function(resolve, reject){
    self._getRepos(args, rapido).then(function(repos){
      resolve(self._writeConfig(repos, config, rapido));
    })
    .catch(function(err){
      rapido.log.error(err);
      reject(err);
    });
  });
};

InitCommand.prototype._writeConfig = function(repos, config, rapido){
  return new Promise(function(resolve, reject){
    rapido.writeConfig(path.join(process.cwd(), rapido.configFilename), {
      dependencies: repos
    });

    if (repos.length > 0) {
      rapido.log.success('Successfully loaded ' + _.map(repos, 'name').join(', '));
    } else {
      rapido.log.info('No repositories found');
    }
    resolve(undefined);
  });
};

InitCommand.prototype._getRepos = function(args, rapido) {
  var self = this;
  var promptProps = {
    properties: {
      name: {
        descritpion: 'Git repository name',
        require: true
      },
      url: {
        description: 'Git repository URL',
        required: true
      },
      more: {
        description: 'Add another repository?',
        default: 'y',
        required: false,
        pattern: /^y|n|yes|no$/i,
        message: 'Must enter yes or no',
        before: function(value){return value.match(/^y|yes$/i);}
      }
    }
  };
  return new Promise(function(resolve, reject){
    if(args.yes){
      return resolve([]);
    }

    rapido.prompt.start();
    var promptGet = Promise.promisify(rapido.prompt.get);
    promptGet(promptProps).then(function(result){
      if(!args.result) args.result = [];

      args.result.push({
        name: result.name,
        url: result.url
      });

      if(result.more){
        resolve(self._getRepos(args, rapido));
      } else {
        resolve(args.result);
      }
    })
    .catch(function(err){
      reject(err);
    });
  });
};
