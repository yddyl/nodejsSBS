var mysql = require('mysql');
var $db = require('../db');
var $sql = require('../sqlMapping');

var db_m='SBSMarathon';
var t_user='users';
var t_record='records';
var t_match='matches';
var t_country='countries';

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
var jtoArrayPace =function (res,ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code:'1',
            msg: 'ret undefined'
        });
    }else {
        var arr = [];
        var data = ret[0];
        var distance;
        var pace;
        for (var i in data) {
            distance = i;
            pace = data[i];
            arr.push({distance, pace});
        }
        res.json(arr);
    }
};
var jtoArraySpeed =function (res,ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code:'1',
            msg: 'ret undefined'
        });
    }else {
        var arr = [];
        var data = ret[0];
        var speed;
        var distance;
        for (var i in data) {
            distance = i;
            speed = 1/data[i]*60;
            arr.push({distance, speed});
        }
        res.json(arr);
    }
};
var jtoArrayAvg =function (res,ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code:'1',
            msg: 'ret undefined'
        });
    }else {
        var arr = [];
        var data;
        for(var t in ret) {
            data=ret[t];
            for (var i in data) {
                title = i;
                content = data[i];
                if (i == "std"||i=="average"||i=="minimum") {
                    var hms = content.split(':');
                    minutes = (+hms[0]) * 60 + (+hms[1]) + ((+hms[2]) / 60);
                    var display = content;
                    var value = minutes;
                    data[i] = {display, value};
                }
            }
            arr.push(data);
        }
        res.json(arr);
    }
};
var jtoArrayDist =function (res,ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code:'1',
            msg: 'ret undefined'
        });
    }else {
        var arr = [];
        var data;
        for(var t in ret) {
            data=ret[t];
            var dist=[];
            var temp=[];
            var Class;
            var total;
            for (var i in data) {
                title = i;
                content = data[i];
                if (i != "class"&& i!="total") {
                    var time = title;
                    var value = content;
                    //data[i] = {time, value};
                    dist.push({time, value});
                }else if(i == "class"){
                    Class=data[i];
                }else if(i == "total"){
                    total=data[i];
                }
            }
            temp.push({Class,total,dist});
            console.log(dist);
            arr.push(temp);
        }
        res.json(arr);
    }
};

module.exports = {
	//compare
	compare:function (req, res, next) {
		var location = req.query.location;
		var gender = req.query.gender;
		var agelow = req.query.agelow;
		var ageup = req.query.ageup;
		var constellation = req.query.constellation;
		var zodiac = req.query.zodiac;
		var segment = req.query.segment;
		var sqlQuery="";
		if(segment){
			switch(segment){
				case "gender":
					BY="auto_gender";
					break;
				case "location":
					BY="auto_location";
					break;
				case "age":
					BY="ELT(CEILING(auto_age/10)-1,'11-20','21-30','31-40','41-50','51-60','61-70','71-80','81-90','91-100')";
					break;
				case "zodiac":
					BY="auto_zodiac";
					break;
				case "constellation":
					BY="auto_constell";
			}
			//sqlQuery='select '+BY+' as '+segment+', count(*) as number FROM "+db_m+"."+db_m+"_ren  where id>0';		
			sqlQuery="select a.segment as 'segment', IF(b.number IS NULL , 0, b.number) as number\
			FROM (\
			select "+BY+" as 'segment', count(id) as number\
			FROM "+db_m+"."+t_user+" group by segment) a \
			left join (\
			select "+BY+" as 'segment', count(id) as number\
			FROM "+db_m+"."+t_user+" where id>0 "
		}else
			sqlQuery="select count(*) as number FROM "+db_m+"."+t_user+" where id>0 ";

		if(location)
			sqlQuery+=" and auto_location=\'"+location+"\'";
		if(gender)
			sqlQuery+=" and auto_gender=\'"+gender+"\'";
		if(agelow)
			sqlQuery+=" and auto_age>\'"+agelow+"\'";
		if(ageup)
			sqlQuery+=" and auto_age<\'"+ageup+"\'";
		if(constellation)
			sqlQuery+=" and auto_constell=\'"+constellation+"\'";
		if(zodiac)
			sqlQuery+=" and auto_zodiac=\'"+zodiac+"\'";
		if(segment)
			sqlQuery+="group by  segment) b on b.segment =a.segment order by segment"
			//sqlQuery+=' group by '+BY;	

		console.log("Compair Query: ",sqlQuery);
	
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(sqlQuery, [segment,location,gender,agelow,ageup,constellation,zodiac], function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    },
	
	//segment
	segment:function (req, res, next) {
		var dataBy = req.query.by;
		switch(dataBy){
			case "gender":
				BY="auto_gender";
				break;
			case "location":
				BY="auto_location";
				break;
			case "age":
				BY="auto_age";
				break;
			case "zodiac":
				BY="auto_zodiac";
				break;
			case "constellation":
				BY="auto_constell";
		}
		if(dataBy!="age"){
			var sqlQuery="select "+BY+" as "+dataBy+", count(*) as number FROM "+db_m+"."+t_user+" group by "+BY;
			//select count(*) as number, auto_gender as gender FROM "+db_m+"."+t_user+" group by auto_gender
		}else{
			var sqlQuery="SELECT ELT(CEILING("+BY+"/10)-1,'11-20','21-30','31-40','41-50','51-60','61-70','71-80','81-90','91-100') as 'range', COUNT(*) as 'number' FROM "+db_m+"."+t_user+" GROUP BY ELT(CEILING("+BY+"/10)-1,'11-20','21-30','31-40','41-50','51-60','61-70','71-80','81-90','91-100')";
		}
		console.log('Compair Query: ',sqlQuery);
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(sqlQuery,BY, function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    },
	
	
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
    //getPace
    getPace: function (req, res, next) {
        var id = req.query.id;
        var match=+req.query.match;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.getPace,[id,match], function(err, result) {
                jtoArrayPace(res,result);
               //jsonWrite(res, result);
                connection.release();
            });
        });
    },
    //getSpeed
    getSpeed: function (req, res, next) {
        var id = req.query.id;
        var match=+req.query.match;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.getPace,[id,match], function(err, result) {
                jtoArraySpeed(res,result);
                //jsonWrite(res, result);
                connection.release();
            });
        });
    },
    //bestTime
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
    //bestRank
    bestRank: function (req, res, next) {
        var id = req.query.id;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.bestRank,id, function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    },
    //avgminByMatch
    /*avgminByMatch: function (req, res, next) {
        var id =+req.query.id;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.avgminByMatch,id, function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    },*/
    avgminByMatch: function (req, res, next) {
        var id =+req.query.id;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.avgminByMatch,id, function(err, result) {
                jtoArrayAvg(res,result);
                connection.release();
            });
        });
    },
    avgPaceById: function (req, res, next) {
        var id =req.query.id;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.avgPaceById,id, function(err, result) {
                jsonWrite(res,result);
                connection.release();
            });
        });
    },
    //avgRecordById
    avgRecordById: function (req, res, next) {
        var id =req.query.id;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.avgRecordById,id, function(err, result) {
                jsonWrite(res,result);
                connection.release();
            });
        });
    },
    //chengjiDistFullByMatch
    chengjiDistFullByMatch: function (req, res, next) {
        var id =+req.query.id;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.chengjiDistFullByMatch,id, function(err, result) {
                jtoArrayDist(res,result);
                connection.release();
            });
        });
    },
    chengjiDistHalfByMatch: function (req, res, next) {
        var id =+req.query.id;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.chengjiDistHalfByMatch,id, function(err, result) {
                jtoArrayDist(res,result);
                //jsonWrite(res,result);
                connection.release();
            });
        });
    },
};