module.exports = function(app){
  var router = app.loopback.Router();
  router.get('/status', app.loopback.status());
  app.use(router);
}
