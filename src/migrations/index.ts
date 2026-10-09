import * as migration_20261008_061718_initial from './20261008_061718_initial'
import * as migration_20261009_090000_add_roles_and_languages from './20261009_090000_add_roles_and_languages'

export const migrations = [
  {
    up: migration_20261008_061718_initial.up,
    down: migration_20261008_061718_initial.down,
    name: '20261008_061718_initial',
  },
  {
    up: migration_20261009_090000_add_roles_and_languages.up,
    down: migration_20261009_090000_add_roles_and_languages.down,
    name: '20261009_090000_add_roles_and_languages',
  },
]
