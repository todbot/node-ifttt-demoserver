var passport = require('passport');

var db = require('./db');

var config = {
    channelKey: 'bbmuXixfX8HrRIZ_Yk4RetCuBr--pbrsL3M3ygkPeCp6Nl_pLsbUcVZDzJY4DUzv'
};

//
var ensureGoodChannelKey = function(req,res,next) {
    var id = req.get('IFTTT-Channel-Key');
    if( id !== config.channelKey ) {
        res.status(401).json( { errors: [ { message: 'bad channel key' } ] } );
    }
    else {
        next();
    }
};

exports.userinfo = [
    passport.authenticate('bearer', { session: false }),

    // req.authInfo is set using the `info` argument supplied by
    // `BearerStrategy`.  It is typically used to indicate scope of the token,
    // and used in access control checks.  For illustrative purposes, this
    // example simply returns the scope in the response.
    function(req, res) {
      res.json( {
          data: {
              id: req.user.id,
              name: req.user.name,
              url: 'http://601db084.ngrok.com/account/?tod=foo'
          }
      });
  }
];

exports.status = [
    ensureGoodChannelKey,
    function(req, res) {
        res.json( {} );
        console.log("accessTokens:", db.accessTokens.getTokens());
    }
];

exports.testsetup = [
    ensureGoodChannelKey,
    function(req, res) {
        res.json( {
            data: {
                samples: {

                },
                accessToken: 'Iaqtf5jDEMOTOKENACCESSTOKEN2f2w'  // FIXME
            }
        });
    }
];

exports.actions = [
    passport.authenticate('bearer', { session: false }),
    ensureGoodChannelKey,

    function(req, res) {
        var action_slug = req.param('action_slug');
        var actionFields = req.body.actionFields;
        var ifttt_source = req.body.ifttt_source;
        var user = req.body.user;
        console.log("action: %j", action_slug);
        console.log("actionFields %j", actionFields);
        console.log("ifttt_source %j", ifttt_source);
        console.log("user %j", user);
        res.json({
            id: 34,
            url: 'http://no-url-for.you/'
        });
    }
];
