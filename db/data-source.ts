import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  database: 'spotify-clone',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'melina',
  entities: ['dist/**/*.entity.js'],
  synchronize: false,
  migrations: ['dist/db/migrations/#.js'],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
