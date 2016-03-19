var co = require('co'),
prompt = require('co-prompt'),
  request = require('superagent'),
  chalk = require('chalk'),
  Promise = require('bluebird');

module.exports.initProject = function(props) {
  return co(function* (){
    var private_token = process.env.PRIVATE_TOKEN || (yield prompt.password('Private Token: '));
    props.gitlab_token = private_token;

    return new Promise(function(resolve, reject){

      request
        .get('https://' + props.repo_url + '/api/v3/groups/' + props.group)
        .set('PRIVATE-TOKEN', private_token)
        .end(function(err, res) {
          if (err) return reject(err);

          var projects = res.body.projects;
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
  });
};
//
// module.exports.initService = function(props){
//   /* TODO leverage init module for most of this
//      create new remote project,
//      transfer remote project to group (if applicable),
//      clone seed project with -o boilerplate (if applicable, init new otherwise),
//      set local remote to new project
//   */
// }
