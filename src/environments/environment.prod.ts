import { IAppEnv } from './type';

export const environment: IAppEnv = {
  production: true,
  mqtt: {
    hostname: 'localhost',
    port: 9001,
    path: '/UI',
    username: 'miagiAPI',
    password: 'C6Z2v1Iy'
  },
  api: {
    url: 'http://localhost:5000',
    token: 'JVYeLZpRQCtpNyTITfGh6OzXRFpYIrjZki_JVV5r',
  }
};
