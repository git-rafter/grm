var Promise = require('bluebird'),
  lodash = require('lodash'),
  fs = Promise.promisifyAll(require('fs')),
  path = require('path'),
  colors = require('colors');

module.exports.list = function(verbose){
  return require('./config')()
    .then(function(config){
      return Promise.reduce(config.dependencies, function(result, item){
        var entry = item;
        if(!verbose){
          entry = lodash.omit(entry, ['url', 'description']);
        }
        return fs.lstatAsync(path.join(process.cwd(), item.name))
          .then(function(data){
            if(data.isDirectory()){
              entry.status = '[INSTALLED]'.green;
            }
            else {
              entry.status = '[UNINSTALLED]'.red;
            }
            result.push(entry);
            return result;
          })
          .catch(function(err){
            entry.status = '[UNINSTALLED]'.red;
            result.push(entry);
            return result;
          });
      }, []);
    });
};

module.exports.update = function(){

};
