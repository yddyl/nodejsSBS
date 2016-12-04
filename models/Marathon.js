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

module.exports = {
    queryAll: function (req, res, next) {
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.queryAll, function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    },
    queryById: function (req, res, next) {
        var id = +req.query.id;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.queryById, id, function(err, result) {
                jsonWrite(res, result);
                connection.release();

            });
        });
    },
    chengjiById: function (req, res, next) {
        var id = +req.query.id;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.chengjiById, id, function(err, result) {
                jsonWrite(res, result);
                connection.release();

            });
        });
    }

};