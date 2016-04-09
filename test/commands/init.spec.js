describe("init-github", function(){
  var InitCommand = require('../../lib/commands/init').InitCommand,
      subject = new InitCommand();

  beforeEach(function(){
    this.sinon = sinon.sandbox.create();
    this.rapido = {
      log: {
        success: this.sinon.spy(),
        info: this.sinon.spy(),
        error: this.sinon.spy()
      },
      writeConfig: this.sinon.spy(),
      prompt: {
        start: this.sinon.spy(),
        get: this.sinon.stub()
      },
      configFilename: 'rafter.json'
    };
  });

  afterEach(function(){
    this.sinon.restore();
  });

  describe('#run()', function(){

    it('should init with repos', function(){
      var self = this;
      var promptResult1 = {
        name: 'myrepo1',
        url: 'myurl1',
        more: true
      };

      var promptResult2 = {
        name: 'myrepo2',
        url: 'myurl2',
        more: false
      };

      var args = {};
      var config = {};

      self.rapido.prompt.get.onFirstCall().yields(undefined, promptResult1);
      self.rapido.prompt.get.onSecondCall().yields(undefined, promptResult2);

      return subject.run(args, config, self.rapido).then(function(){
        assert(self.rapido.prompt.start.calledTwice, 'prompt was not started');
        assert(self.rapido.writeConfig.calledOnce, 'config was not written to disk');
        assert(self.rapido.log.success.calledOnce, 'did not configure any repos');
      });
    });

    it('should throw error in prompt', function(){
      var self = this;

      var args = {};
      var config = {};

      self.rapido.prompt.get.onFirstCall().throws("Error");

      return subject.run(args, config, self.rapido).catch(function(err){
        assert(self.rapido.prompt.start.calledOnce, 'prompt was not started');
        assert(self.rapido.log.error.calledOnce, 'did not configure any repos');
      });
    });
  });
});
