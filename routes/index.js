var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/manager', function(req, res, next) {
  res.render('manager');
});

router.get('/manager/goods', function(req, res, next) {
  res.render('goods');
});

module.exports = router;
