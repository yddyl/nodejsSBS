var express = require('express');
var router = express.Router();
var malasong= require('../models/Marathon');
/* GET users listing. */
router.get('/', function(req, res, next) {
    malasong.queryAll(req, res, next);
});
router.get('/queryById', function(req, res, next) {
    malasong.queryById(req, res, next);
});
router.get('/chengjiById', function(req, res, next) {
    malasong.chengjiById(req, res, next);
});

module.exports = router;