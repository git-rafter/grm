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
      }
    };
  });

  afterEach(function(){
    this.sinon.restore();
  });

  describe('#run()', function(){

    it('should init with repos', function(done){
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

      this.rapido.prompt.get.onFirstCall().yields(undefined, promptResult1);
      this.rapido.prompt.get.onSecondCall().yields(undefined, promptResult2);

      subject.run(args, config, this.rapido).then(function(){
        assert(this.rapido.prompt.start.calledOnce, 'prompt was not started');
        assert(this.rapido.writeConfig.calledOnce, 'config was not written to disk');
        assert(this.rapido.logg.success.calledOnce, 'did not configure any repos');
        done();
      })
      .catch(function(err){
        expect(err).to.be.undefined;
        done();
      });
    });
  });
});
