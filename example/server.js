var loopback = require('loopback');
var boot = require('loopback-boot');
var app = module.exports = loopback();

boot(app, __dirname);

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s, environment: %s', app.get('url'), process.env.NODE_ENV || "default");
  });
};

// start the server if `$ node server.js`
if (require.main === module || GLOBAL.PhusionPassenger) {
  app.start();
}
