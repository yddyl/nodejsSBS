var user = {
    //insert:'INSERT INTO book(id, name, author) VALUES(0,?,?)',
    //update:'update book set name=?, age=? where id=?',
    //delete: 'delete from book where id=?',

    //个人基本信息 by IDnumber
    renById: 'select * from malasong_ren where IDnumber=?',
    //个人基本信息 by 名字
    renByName: 'select * from malasong_ren where name=?',

    //个人所有参赛成绩 by IDnumber
    chengjiById:'select (rank/(select totalNum from malasong.malasong_bisai where malasong_chengji.matchid=malasong_bisai.matchid)) AS newRank, malasong_bisai.mdate, (time_to_sec(finalrecord)/60) as finalrecordMins, malasong.malasong_bisai.*,malasong_chengji.*from malasong.malasong_chengji,malasong.malasong_bisai where malasong_bisai.matchid =malasong_chengji.matchid AND malasong.malasong_chengji.IDnumber=? order by malasong_bisai.mdate;',
    //单个比赛 全部信息，包括选手名字
    chengjiByMatch:'SELECT malasong.malasong_ren.name,malasong.malasong_ren.gender, malasong.malasong_chengji.* FROM malasong.malasong_chengji, malasong.malasong_ren WHERE malasong_chengji.IDnumber=malasong_ren.IDnumber AND malasong_chengji.matchid=? ORDER BY rank limit 400',

    //所有比赛信息
    bisaiAll: 'SELECT * FROM malasong_bisai',
    //单个比赛基本信息
    bisaiById:'SELECT * FROM malasong_bisai where matchid=?',
    //单个比赛成绩，Rank排序
    chengjiAnRank:'select * from malasong_chengji where matchid=? ORDER BY rank limit 200',
    //####------------------NWE------------------#############

    getPace:"SELECT (time_to_sec(5km)/60)/5 AS '5km', ((time_to_sec(10km)-time_to_sec(5km))/60)/5 AS '10km',((time_to_sec(15km)-time_to_sec(10km))/60)/5 AS '15km', ((time_to_sec(20km)-time_to_sec(15km))/60)/5 AS '20km', ((time_to_sec(25km)-time_to_sec(20km))/60)/5 AS '25km',((time_to_sec(30km)-time_to_sec(25km))/60)/5 AS '30km', ((time_to_sec(35km)-time_to_sec(30km))/60)/5 AS '35km', ((time_to_sec(40km)-time_to_sec(35km))/60)/5 AS '40km', ((time_to_sec(42km)-time_to_sec(40km))/60)/2.195 AS '42.195km' FROM malasong.malasong_chengji where IDnumber=? And matchid=?",
    //getSpeed:'SELECT (time_to_sec(5km)/60)/5 AS 0to5, ((time_to_sec(10km)-time_to_sec(5km))/60)/5 AS 5to10,((time_to_sec(15km)-time_to_sec(10km))/60)/5 AS 10to15, ((time_to_sec(20km)-time_to_sec(15km))/60)/5 AS 15to20, ((time_to_sec(25km)-time_to_sec(20km))/60)/5 AS 20to25,((time_to_sec(30km)-time_to_sec(25km))/60)/5 AS 25to30, ((time_to_sec(35km)-time_to_sec(30km))/60)/5 AS 30to35, ((time_to_sec(40km)-time_to_sec(35km))/60)/5 AS 35to40, ((time_to_sec(42km)-time_to_sec(40km))/60)/2.195 AS 40to45   FROM malasong.malasong_chengji where IDnumber=? And matchid=?',
    bestTime:'select malasong.malasong_bisai.*,malasong_chengji.*from malasong.malasong_chengji,malasong.malasong_bisai where malasong_bisai.matchid =malasong_chengji.matchid AND malasong.malasong_chengji.IDnumber=? order by finalrecord limit 1',
    bestRank:'select (rank/(select totalNum from malasong.malasong_bisai where malasong_chengji.matchid=malasong_bisai.matchid)) AS newRank,(time_to_sec(finalrecord)/60) as finalrecordMins,rank,totalNum,malasong_bisai.*,malasong_chengji.*from malasong.malasong_chengji,malasong.malasong_bisai where malasong_bisai.matchid =malasong_chengji.matchid AND malasong_chengji.IDnumber=? order by newRank limit 10',
    avgminByMatch:'select matchid,class,SEC_TO_TIME(std(time_to_sec(finalrecord))) as std, SEC_TO_TIME(avg(time_to_sec(finalrecord))) as average,SEC_TO_TIME(min(time_to_sec(finalrecord))) as minimum from malasong.malasong_chengji where matchid=? group by class'
};

module.exports = user;