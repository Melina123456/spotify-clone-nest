import { Injectable } from '@nestjs/common';

@Injectable()
export class DevConfigService {
  DBHOST = 'Localhost';
  getDBHOST() {
    return this.DBHOST;
  }
}
