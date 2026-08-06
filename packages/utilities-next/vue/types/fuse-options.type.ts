import type { IFuseOptions as FuseJsOptions } from 'fuse.js'
import type { Required } from 'utility-types'

export type IFuseOptions<T = any> = Required<FuseJsOptions<T>, 'keys'>
