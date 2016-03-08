var Promise = require('bluebird');

module.exports = function(){
  var readFile = Promise.promisify(require('fs').readFile);
  return readFile(require('path').join(process.cwd(), 'gdm.json'))
    .then(function(data){
      return JSON.parse(data);
    });
}
