import { authHandlers } from './auth'
import { nftHandlers } from './nfts'
import { favoriteHandlers } from './favorites'

export const handlers = [...authHandlers, ...nftHandlers, ...favoriteHandlers]