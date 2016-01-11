var passport = require('passport');
var _ = require('lodash');

var db = require('./db');

var handleBlink = function() {
    return({
        data: [
            {
                id: 34,
                url: 'http://no-url-for.you/'
            }
        ]
    });
};

var handleSetColor = function() {
    return({
        data: [
            {
                id: 34,
                url: 'http://no-url-for.you/'
            }
        ]
    });
};

var config = {
    channelKey: 'bbmuXixfX8HrRIZ_Yk4RetCuBr--pbrsL3M3ygkPeCp6Nl_pLsbUcVZDzJY4DUzv',
    actions: {
        'blink': { handler: handleBlink },
        'setcolor' : { handler: handleSetColor }
    }
};

// express middleware auth check for ifttt key
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
    passport.authenticate('bearer', { session: false, failWithError: true }),

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
                "samples": {
                   "actions": {
                     "blink": { "rule_name": "test1" },
                     "setcolor": { "what_color": "#FF00FF" }
                   },
                   "actionRecordSkipping": {
                     "blink": { "rule_name": "test1" },
                     "setcolor": { "what_color": "#FF00FF" }
                   }
               },
               accessToken: 'Iaqtf5jDEMOTOKENACCESSTOKEN2f2w' // FIXME
           }
        });
    }
];

exports.actions = [
    passport.authenticate('bearer', { session: false, failWithError: true }),
    // ensureGoodChannelKey,

    function(req, res) {
        var x_req_id = req.get('X-Request-ID');
        var action_slug = req.param('action_slug');
        var actionFields = req.body.actionFields;
        var ifttt_source = req.body.ifttt_source;
        var user = req.body.user;
        var errormsg = '';

        console.log("\tbody: %j", req.body);
        console.log("\tx_req_id: %j", x_req_id);
        console.log("\taction: %j", action_slug);
        console.log("\tactionFields %j", actionFields);
        console.log("\tifttt_source %j", ifttt_source);
        console.log("\tuser %j", user);

        if( !actionFields || _.isEmpty( actionFields ) ) {
            res.status(400).json({
                errors: [{ message: "no actionFields" }]
            });
        }
        else if( config.actions[action_slug] ) {
            res.json( config.actions[action_slug].handler( actionFields, ifttt_source, user) );
        }
    }
];


// var oauthenticate = function(req,res,next) {
//     passport.authenticate('bearer', { session: false }, function(err, user, info) {
//         if (err) { return next(err); } // will generate a 500 error
//         if (!user) {
//           return res.send({ success : false, message : 'authentication failed' });
//         }
//         // return res.send({ success : true, message : 'authentication succeeded' });
//         // return next();
//         res.json({});
//     })(req, res, next);
// };
