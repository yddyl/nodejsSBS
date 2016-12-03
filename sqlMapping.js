var user = {
    insert:'INSERT INTO book(id, name, author) VALUES(0,?,?)',
    update:'update book set name=?, age=? where id=?',
    delete: 'delete from book where id=?',
    queryById: 'select * from malasong_bisai where matchid=?',
    queryAll: 'SELECT * FROM malasong_bisai '
};

module.exports = user;