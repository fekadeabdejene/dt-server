var express  = require('express');
var MockDB   = require('../integration-tests/dt-mock-sql3-db')
var DTServer = require('../../index.js');
var router   = express.Router();

router.get('/', function(req, res, next) {
  res.sendFile('public/index.html', { root: __dirname });
});

router.get('/dtsql3', function(req, res, next) {
  MockDB.InitializeDB(function(db) {
    var dtServer = DTServer('sql3', db)
    dtServer.get(req.query,'USERS')
    .then(function(results) {
      res.status(200)
      .json(results)
    })
    .catch(function(err) {
      res.status(400).json(err)
    })
  })
})

module.exports = router;
