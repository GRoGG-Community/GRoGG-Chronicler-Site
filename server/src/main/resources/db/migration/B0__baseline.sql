create table empires
(
    id integer primary key,
    name text not null,
    lore text,
    stats text,
    ethics text,
    special text
);

create table accounts
(
    id integer primary key,
    name text not null
);

create table accountEmpires (
    account_id integer not null,
    empire_id integer not null,
    primary key (account_id, empire_id),
    foreign key (account_id) references accounts(id) on delete cascade,
    foreign key (empire_id) references empires(id) on delete cascade
)