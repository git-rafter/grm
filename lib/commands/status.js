var path = require('path'),
    _ = require('lodash'),
    Promise = require('bluebird'),
    fs = Promise.promisifyAll(require('fs')),
    Git = require('nodegit'),
    columnify = require('columnify');

module.exports = (function(){
  return new StatusCommand();
})();

module.exports.StatusCommand = StatusCommand;

function StatusCommand() {
  this.usage = 'Usage: $0 status';
  this.options = {
    'verbose': {
      describe: 'Shows a more detailed status',
      boolean: true,
      alias: 'v'
    }
  };
}

StatusCommand.prototype.validate = function(args, rapido) {
  return {
    verbose: args.verbose === true
  };
};

StatusCommand.prototype.run = function(args, config, rapido) {
  return Promise.map(config.dependencies, function(result, dep){
    var entry = dep;
    if(!args.verbose){
      entry = {name: dep.name};
    }
    result.push(entry);
    var repo = path.join(process.cwd(), dep.name, '.git');
    return fs.lstatAsync(repo)
      .then(function(data){
        if(data.isDirectory()){
          entry.status = '[INSTALLED]'.green;
          // TODO figure out how to get number of commits ahead of remote
          return Git.Repository.open(repo).then(function(repository) {
            return repository.getStatus();
          })
          .then(function(status){
            entry.gitStatus = _.isEmpty(status) ? '[COMMITTED]'.green : '[UNCOMMITTED]'.red;
            return result;
          });
        }
        else {
          entry.status = '[UNINSTALLED]'.red;
          return result;
        }
      })
      .catch(function(err){
        entry.status = '[UNINSTALLED]'.red;
        return result;
      });
  }, [])
  .then(function(data) {
    if(data){
      var columns = ['name', 'status', 'gitStatus'];
      if(args.verbose) {
        columns = ['name', 'url', 'status', 'gitStatus'];
      }
      rapido.log.info(columnify(data, {columns: columns, gitStatus: (heading) => {return 'GIT STATUS'}}))
    } else {
      rapido.log.error("Failed to read rafter.json file");
    }
  });
};
