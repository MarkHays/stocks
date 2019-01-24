use stockappdb;


insert into USERS (user_id, budget) values ("f",300);



insert into POSITIONS (user_id, quantity, symbol) values ("f",1,"AAPL");
insert into POSITIONS (user_id, quantity, symbol) values ("f",1,"NVDA");
insert into POSITIONS (user_id, quantity, symbol) values ("f",1,"SPY");

select * from Users;

select * from POSITIONS;

DROP TABLE Users;

DROP TABLE POSITIONS;