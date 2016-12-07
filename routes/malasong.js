var express = require('express');
var router = express.Router();
var malasong= require('../models/Marathon');
/* GET users listing. */
router.get('/', function(req, res, next) {
    malasong.bisaiAll(req, res, next);
});
router.get('/renById', function(req, res, next) {
    malasong.renById(req, res, next);
});
router.get('/renByName', function(req, res, next) {
    malasong.renByName(req, res, next);
});
router.get('/chengjiById', function(req, res, next) {
    malasong.chengjiById(req, res, next);
});
router.get('/chengjiByMatch', function(req, res, next) {
    malasong.chengjiByMatch(req, res, next);
});
router.get('/bisaiById', function(req, res, next) {
    malasong.bisaiById(req, res, next);
});
router.get('/chengjiAnRank', function(req, res, next) {
    malasong.chengjiAnRank(req, res, next);
});
router.get('/getPace', function(req, res, next) {
    malasong.getPace(req, res, next);
});
router.get('/getSpeed', function(req, res, next) {
    malasong.getSpeed(req, res, next);
});
router.get('/bestTime', function(req, res, next) {
    malasong.bestTime(req, res, next);
});
router.get('/bestRank', function(req, res, next) {
    malasong.bestRank(req, res, next);
});
router.get('/avgminByMatch', function(req, res, next) {
    malasong.avgminByMatch(req, res, next);
});

module.exports = router;