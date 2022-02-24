require("dotenv").config();

const express = require('express');
const router = express.Router();
const requestUrl = process.env.API_URL;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {requestUrl : requestUrl});
});

router.get('/manager', function(req, res, next) {
  res.render('manager/manager', {requestUrl : requestUrl});
});

router.get('/manager/item', function(req, res, next) {
  res.render('manager/item/item', {requestUrl : requestUrl});
});

router.get('/manager/item/reg', function(req, res, next) {
  res.render('manager/item/reg', {requestUrl : requestUrl});
});

router.post('/manager/item/reg', function(req, res, next) {
  console.log("이미지 업로드");
});

module.exports = router;
