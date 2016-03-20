var prompt = require('co-prompt'),
  request = require('superagent'),
  chalk = require('chalk'),
  Promise = require('bluebird');

module.exports.initProject = function(props) {
  return new Promise(function(resolve, reject){
    var url = 'https://api.' + props.repo_url + '/orgs/' + props.group + '/repos';
    request
      .get(url)
      .end(function(err, res) {
        if (err) return reject(err);
        if (!res.body || res.body.constructor !== Array){
          return reject({'error': "Unexpected response from repo", 'response': res});
        }

        var projects = res.body;
        props.dependencies = [];

        projects.forEach(function(repo) {
          for (var key in repo) {
            if (repo[key] && repo[key].constructor === String && repo[key].match(/git@.*:.*.git/i)) {
              var git_url = repo[key];
              break;
            }
          }

          var name = repo.name.replace(' ', '_');
          var description = repo.description;
          props.dependencies.push({
            name: name,
            description: description,
            url: git_url
          });
        });

        resolve(props);
      });
  });

};

module.exports.initService = function(parentConfig){
  /* TODO leverage init module for most of this
     create new remote project,
     transfer remote project to group (if applicable),
     clone seed project with -o boilerplate (if applicable, init new otherwise),
     set local remote to new project
  */
}
