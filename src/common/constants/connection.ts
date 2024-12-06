export const connection: Connection = {
  CONNECTION_STRING: 'MYSQL://1234/melina',
  DB: 'MYSQL',
  DBNAME: 'TEST',
};

export type Connection = {
  CONNECTION_STRING: string;
  DB: string;
  DBNAME: string;
};
