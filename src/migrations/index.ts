import * as migration_20261008_061718_initial from './20261008_061718_initial';

export const migrations = [
  {
    up: migration_20261008_061718_initial.up,
    down: migration_20261008_061718_initial.down,
    name: '20261008_061718_initial'
  },
];
