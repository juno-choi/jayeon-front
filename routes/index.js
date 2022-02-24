var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/manager', function(req, res, next) {
  res.render('manager/manager');
});

router.get('/manager/item', function(req, res, next) {
  res.render('manager/item/item');
});

router.get('/manager/item/reg', function(req, res, next) {
  res.render('manager/item/item_reg');
});

module.exports = router;
