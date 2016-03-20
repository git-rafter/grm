module.exports = {
    usage: 'Usage: $0 status',

    options: {

    },

    validate: function(args, rapido) {
        return args;
    },

    run: function(args, config, rapido) {

        rapido.log.success('Command says: status');
    }
}
