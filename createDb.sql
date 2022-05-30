create table Email (
  id int primary key,
  createdAt timestamp not null,
  subject varchar not null
);
create table View (
  id serial primary key,
  viewDate timestamp not null,
  ip varchar,
  emailId int,
  foreign key(emailId) references Email(id)

);

