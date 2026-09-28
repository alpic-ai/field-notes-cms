import * as migration_20260928_135629_initial from './20260928_135629_initial';

export const migrations = [
  {
    up: migration_20260928_135629_initial.up,
    down: migration_20260928_135629_initial.down,
    name: '20260928_135629_initial'
  },
];
