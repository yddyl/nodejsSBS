var mysql = require('mysql');
var $db = require('../db');
var $sql = require('../sqlMapping');

// 使用连接池，提升性能
var pool  = mysql.createPool( $db.mysql);

// 向前台返回JSON方法的简单封装
var jsonWrite = function (res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code:'1',
            msg: 'ret undefined'
        });
    } else {
        res.json(ret);
    }
};
var jtoArray =function (res,ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code:'1',
            msg: 'ret undefined'
        });
    }else {
        var arr = [];
        var data = ret[0];
        for (var i in data) {
            var time = i;
            var pace = data[i];
            arr.push({time, pace});
        }
        res.json(arr);
    }
};

module.exports = {
    //BiSaiAll
    bisaiAll: function (req, res, next) {
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.bisaiAll, function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    },
    //RenByID
    renById: function (req, res, next) {
        var id = req.query.id;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.renById, id, function(err, result) {
                jsonWrite(res, result);
                connection.release();

            });
        });
    },
    //RenByName
    renByName: function (req, res, next) {
        var id = req.query.id;
        console.log(id);
        console.log(req.query.id);
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.renByName, id, function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    },
    //ChengJiByID
    chengjiById: function (req, res, next) {
        var id = req.query.id;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.chengjiById, id, function(err, result) {
                jsonWrite(res, result);
                connection.release();

            });
        });
    },
    //ChengJiByMatch
    chengjiByMatch: function (req, res, next) {
        var id = +req.query.id;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.chengjiByMatch, id, function(err, result) {
                jsonWrite(res, result);
                connection.release();

            });
        });
    },
    //BiSaiBy matchID
    bisaiById: function (req, res, next) {
        var id = +req.query.id;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.bisaiById, id, function(err, result) {
                jsonWrite(res, result);
                connection.release();

            });
        });
    },
    //chengjiAnRank
    chengjiAnRank: function (req, res, next) {
        var id = req.query.id;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.chengjiAnRank, id, function(err, result) {
                jsonWrite(res, result);
                connection.release();

            });
        });
    },


    getPace: function (req, res, next) {
        var id = req.query.id;
        var match=+req.query.match;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.getPace,[id,match], function(err, result) {
             //   console.log(result);
                jtoArray(res,result);
               //jsonWrite(res, result);
                connection.release();
            });
        });
    },
    bestTime: function (req, res, next) {
        var id = req.query.id;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.bestTime,id, function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    },
    bestRank: function (req, res, next) {
        var id = req.query.id;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.bestRank,id, function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    }
};