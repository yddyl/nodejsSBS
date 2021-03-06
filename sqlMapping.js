﻿var db_m='SBSMarathon';
var t_user='users';
var t_record='records';
var t_country='countries';
var t_match='matches';

var user = {
    //insert:'INSERT INTO book(id, name, author) VALUES(0,?,?)',
    //update:'update book set name=?, age=? where id=?',
    //delete: 'delete from book where id=?',

    //个人基本信息 by IDnumber
    renById: "select * from "+t_user+" where IDnumber=?",
    //个人基本信息 by 名字
    renByName: "select * from "+t_user+" where name=?",

    //个人所有参赛成绩 by IDnumber
    chengjiById:"select \
		(rank/(select totalNum from "+db_m+"."+t_match+" where "+t_record+".matchid="+t_match+".matchid)) AS newRank, \
		"+t_match+".mdate, \
		(time_to_sec(finalrecord)/60) as finalrecordMins, \
		"+db_m+"."+t_match+".*,"+t_record+".*\
		from "+db_m+"."+t_record+","+db_m+"."+t_match+" \
		where "+t_match+".matchid ="+t_record+".matchid AND "+db_m+"."+t_record+".IDnumber=? \
		order by "+t_match+".mdate;",
    //单个比赛 全部信息，包括选手名字
    chengjiByMatch:"SELECT "+db_m+"."+t_user+".name,\
		"+db_m+"."+t_user+".gender, \
		"+db_m+"."+t_record+".* \
		FROM "+db_m+"."+t_record+", "+db_m+"."+t_user+" \
		WHERE "+t_record+".IDnumber="+t_user+".IDnumber AND "+t_record+".matchid=? \
		ORDER BY rank limit 400",

    //所有比赛信息
    bisaiAll: "SELECT * FROM "+t_match+"",
    //单个比赛基本信息
    bisaiById:"SELECT * FROM "+t_match+" where matchid=?",
    //单个比赛成绩，Rank排序
    chengjiAnRank:"select * from "+t_record+" where matchid=? ORDER BY rank limit 200",

    //Pace:分钟/公里；
    getPace:"SELECT (time_to_sec(5km)/60)/5 AS '5km', \
		((time_to_sec(10km)-time_to_sec(5km))/60)/5 AS '10km',\
		((time_to_sec(15km)-time_to_sec(10km))/60)/5 AS '15km',\
		((time_to_sec(20km)-time_to_sec(15km))/60)/5 AS '20km',\
		((time_to_sec(25km)-time_to_sec(20km))/60)/5 AS '25km',\
		((time_to_sec(30km)-time_to_sec(25km))/60)/5 AS '30km',\
		((time_to_sec(35km)-time_to_sec(30km))/60)/5 AS '35km',\
		((time_to_sec(40km)-time_to_sec(35km))/60)/5 AS '40km',\
		((time_to_sec(42km)-time_to_sec(40km))/60)/2.195 AS '42.195km' \
		FROM "+db_m+"."+t_record+" \
		where IDnumber=? And matchid=?",
    //getSpeed 已有；
    //getSpeed:'SELECT (time_to_sec(5km)/60)/5 AS 0to5, ((time_to_sec(10km)-time_to_sec(5km))/60)/5 AS 5to10,((time_to_sec(15km)-time_to_sec(10km))/60)/5 AS 10to15, ((time_to_sec(20km)-time_to_sec(15km))/60)/5 AS 15to20, ((time_to_sec(25km)-time_to_sec(20km))/60)/5 AS 20to25,((time_to_sec(30km)-time_to_sec(25km))/60)/5 AS 25to30, ((time_to_sec(35km)-time_to_sec(30km))/60)/5 AS 30to35, ((time_to_sec(40km)-time_to_sec(35km))/60)/5 AS 35to40, ((time_to_sec(42km)-time_to_sec(40km))/60)/2.195 AS 40to45   FROM "+db_m+"."+t_record+" where IDnumber=? And matchid=?',
    //bestTime By ID
    bestTime:"select "+db_m+"."+t_match+".*,"+t_record+".*\
		from "+db_m+"."+t_record+","+db_m+"."+t_match+" \
		where "+t_match+".matchid ="+t_record+".matchid AND "+db_m+"."+t_record+".IDnumber=? \
		order by finalrecord limit 1",
    //bestRank By ID
    bestRank:"select \
			(rank/(select totalNum from "+db_m+"."+t_match+" where "+t_record+".matchid="+t_match+".matchid)) AS newRank,\
		(time_to_sec(finalrecord)/60) as finalrecordMins,rank,totalNum,"+t_match+".*,"+t_record+".*\
		from "+db_m+"."+t_record+","+db_m+"."+t_match+" \
		where "+t_match+".matchid ="+t_record+".matchid AND "+t_record+".IDnumber=? \
		order by newRank limit 10",
    avgminByMatch:"select matchid,class,SEC_TO_TIME(std(time_to_sec(finalrecord))) as std,\
		SEC_TO_TIME(avg(time_to_sec(finalrecord))) as average,\
		SEC_TO_TIME(min(time_to_sec(finalrecord))) as minimum \
		from "+db_m+"."+t_record+" \
		where matchid=? \
		group by class",
    avgPaceById:"SELECT count(IDnumber) counting, sum(time_to_sec(5km))/60/5/count(IDnumber) AS '0-5km',\
		sum(time_to_sec(10km)-time_to_sec(5km))/60/5/count(IDnumber) AS '5-10km',\
		sum(time_to_sec(15km)-time_to_sec(10km))/60/5/count(IDnumber) AS '10-15km',\
		sum(time_to_sec(20km)-time_to_sec(15km))/60/5/count(IDnumber) AS '15-20km',\
		sum(time_to_sec(21km)-time_to_sec(15km))/60/6.1/count(IDnumber) AS '15-21km',\
		sum(time_to_sec(25km)-time_to_sec(20km))/60/5/count(IDnumber) AS '20-25km',\
		sum(time_to_sec(30km)-time_to_sec(25km))/60/5/count(IDnumber) AS '20-30km',\
		sum(time_to_sec(35km)-time_to_sec(30km))/60/5/count(IDnumber) AS '30-35km',\
		sum(time_to_sec(40km)-time_to_sec(35km))/60/5/count(IDnumber) AS '35-40km',\
		sum(time_to_sec(42km)-time_to_sec(40km))/60/2.195/count(IDnumber) AS '40-42.195km',class \
		from "+db_m+"."+t_record+" \
		where IDnumber=? and (5km<>'00:00:00' or 10km<>'00:00:00'or 15km<>'00:00:00' or 20km<>'00:00:00'or 21km<>'00:00:00'or 25km<>'00:00:00'or 30km<>'00:00:00'or 35km<>'00:00:00'or 40km<>'00:00:00'or 42km<>'00:00:00') \
		group by class",
    avgRecordById:"select count(*) counting, class,\
        sum((rank/(select totalNum from "+db_m+"."+t_match+" where "+t_record+".matchid="+t_match+".matchid)))/count(*) AS avgNewRank,\
        sec_to_time( sum(time_to_sec(finalrecord))/count(*)) avgRecord,42.195/(sum(time_to_sec(finalrecord))/count(*)/60/60) 'avgSpeed(km/h)',\
        sum(time_to_sec(finalrecord))/count(*)/60/42.195 'avgPace(min/km)' \
        from "+db_m+"."+t_record+" \
        where IDnumber=? group by class",
    chengjiDistFullByMatch:"select class,count(finalrecord) as total,\
        sum(case when finalrecord < '02:00:00' then 1 else 0 end) as '肯定bug了',\
        sum(case when finalrecord > '02:00:00' and finalrecord < '02:30:00' then 1 else 0 end) as '2~2.5hr',\
        sum(case when finalrecord > '02:30:00' and finalrecord < '03:00:00' then 1 else 0 end) as '2.5~3hr',\
        sum(case when finalrecord > '03:00:00' and finalrecord < '03:30:00' then 1 else 0 end) as '3~3.5hr',\
        sum(case when finalrecord > '03:30:00' and finalrecord < '04:00:00' then 1 else 0 end) as '3.5~4hr',\
        sum(case when finalrecord > '04:00:00' and finalrecord < '04:30:00' then 1 else 0 end) as '4~4.5hr',\
        sum(case when finalrecord > '04:30:00' and finalrecord < '05:00:00' then 1 else 0 end) as '4.5~5hr',\
        sum(case when finalrecord > '05:00:00' and finalrecord < '05:30:00' then 1 else 0 end) as '5~5.5hr',\
        sum(case when finalrecord > '05:30:00' and finalrecord < '06:00:00' then 1 else 0 end) as '5.5~6hr',\
        sum(case when finalrecord > '06:00:00'  then 1 else 0 end) as '6hr~'\
        from "+db_m+"."+t_record+" \
		where matchid =? and (class='男子全程' or class='女子全程')  \
		group by class;",
    chengjiDistHalfByMatch:"select class,count(finalrecord) as total,\
        sum(case when finalrecord < '01:00:00' then 1 else 0 end) as '竟然不是bug',\
        sum(case when finalrecord > '01:00:00' and finalrecord < '01:15:00' then 1 else 0 end) as '1~1.25hr',\
        sum(case when finalrecord > '01:15:00' and finalrecord < '01:30:00' then 1 else 0 end) as '1.25~1.5hr',\
        sum(case when finalrecord > '01:30:00' and finalrecord < '01:45:00' then 1 else 0 end) as '1.5~1.75hr',\
        sum(case when finalrecord > '01:45:00' and finalrecord < '02:00:00' then 1 else 0 end) as '1.75~2hr',\
        sum(case when finalrecord > '02:00:00' and finalrecord < '02:15:00' then 1 else 0 end) as '2~2.25hr',\
        sum(case when finalrecord > '02:15:00' and finalrecord < '02:30:00' then 1 else 0 end) as '2.25~2.5hr',\
        sum(case when finalrecord > '02:30:00' and finalrecord < '02:45:00' then 1 else 0 end) as '2.5~2.75hr',\
        sum(case when finalrecord > '02:45:00' and finalrecord < '03:00:00' then 1 else 0 end) as '2.75~2hr',\
        sum(case when finalrecord > '03:00:00'  then 1 else 0 end) as '3hr~'\
        from "+db_m+"."+t_record+" \
		where matchid =? and (class='男子半程' or class='女子半程')  \
		group by class;"
};

module.exports = user;