// first token is a demo token FIXME
var tokens = {
Iaqtf5jDEMOTOKENACCESSTOKEN2f2w: { userID: '999', clientID: '888' }
};


exports.find = function(key, done) {
  var token = tokens[key];
  return done(null, token);
};

exports.save = function(token, userID, clientID, done) {
  tokens[token] = { userID: userID, clientID: clientID };
  return done(null);
};

// FIXME: hack test
exports.getTokens = function() { return tokens; };
