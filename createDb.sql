drop table view;
drop table email;
create type emailStatus as ENUM ('sent', 'unsent');

create table Email (
  id int primary key,
  createdAt timestamp not null,
  subject varchar not null,
  status emailStatus default 'unsent'
);
create table View (
  id serial primary key,
  viewDate timestamp not null,
  ip varchar,
  emailId int,
  foreign key(emailId) references Email(id)

);

