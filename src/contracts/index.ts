import { z } from 'zod'

export const EthSchema = z.string().regex(/^\d+(\.\d{1,18})?$/, 'Valor ETH inválido')
export type Eth = z.infer<typeof EthSchema>

export const PageSchema = <T extends z.ZodType>(item: T) =>
  z.object({
    items: z.array(item),
    page: z.number().int().min(1),
    pageSize: z.number().int().min(1),
    total: z.number().int().min(0),
    totalPages: z.number().int().min(0),
  })


/* erros */
export const ApiErrorCodeSchema = z.enum([
    'VALIDATION', //400/422
    'UNAUTHENTICATED', //401 
    'FORBIDDEN', //403
    'NOT_FOUND', //404
    'CONFLICT', //409
    'TRANSIENT', // 5xx/timeout
    'NETWORK', // s resposta    
])    

export type ApiErrorCode = z.infer<typeof ApiErrorCodeSchema>

export const ApiErrorBodySchema = z.object({
    code: ApiErrorCodeSchema,
    message: z.string(),
    fieldErrors: z.record(z.string(), z.string()).optional(),
    detail: z.record(z.string(), z.unknown()).optional(),
})

export type ApiErrorBody = z.infer<typeof ApiErrorBodySchema>

export class ApiError extends Error {
    readonly code: ApiErrorCode
    readonly status?: number
    readonly fieldErrors?: Record<string, string>
    readonly detail?: Record<string, unknown>


    constructor(
        code: ApiErrorCode,
        message: string,
        status?: number,
        fieldErrors?: Record<string, string>,
        detail?: Record<string, unknown>,
    ) {
        super(message)
        this.name = 'ApiError'
        this.code = code
        this.status = status
        this.fieldErrors = fieldErrors
        this.detail = detail
    }
}

/*Usuario , sessao e categoria*/
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  avatarUrl: z.string().nullable(),
})
export type User = z.infer<typeof UserSchema>

export const SessionSchema = z.object({
  user: UserSchema,
  expiresAt: z.string(), // ISO
})
export type Session = z.infer<typeof SessionSchema>

export const AuthResponseSchema = z.object({
  token: z.string(),
  session: SessionSchema,
})
export type AuthResponse = z.infer<typeof AuthResponseSchema>

export const LoginInputSchema = z.object({
    email: z.email('E-mail inválido'),
    password: z.string().min(8, 'Minimo de 8 caracteres'),
})
export type LoginInput = z.infer<typeof LoginInputSchema>

export const SignupInputSchema = LoginInputSchema.extend({
    name: z.string().min(2, 'Informe seu nome'),
})

export type SignupInput = z.infer<typeof SignupInputSchema>

export const NetworkSchema = z.enum(['ethereum', 'polygon', 'arbitrum'])
export type Network = z.infer<typeof NetworkSchema>

export const WalletSchema = z.object({
    id: z.string(),
    label: z.string(),
    address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Endereço inválido'),
    network: NetworkSchema,
    isPrimary: z.boolean(),
})
export type Wallet = z.infer<typeof WalletSchema>

/* NFTs */
export const NftSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    collection: z.string(),
    category: z.string(),
    creator: z.string(),
    image: z.string(),
    gallery: z.array(z.string()),
    price: EthSchema,
    editionsAvailable: z.number().int().min(0),
    maxPerOrder: z.number().int().min(1),
    version: z.number().int(),
})
export type Nft = z.infer<typeof NftSchema>

export const CatalogParamsSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  collection: z.string().optional(),
  minPrice: EthSchema.optional(),
  maxPrice: EthSchema.optional(),
  sort: z.enum(['recent', 'price_asc', 'price_desc', 'name']).default('recent'),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(48).default(12),
})
export type CatalogParams = z.infer<typeof CatalogParamsSchema>

/* Carrinho e cotação */
export const CartItemSchema = z.object({
  nftId: z.string(),
  quantity: z.number().int().min(1),
})
export type CartItem = z.infer<typeof CartItemSchema>

export const CartSchema = z.object({
  items: z.array(CartItemSchema.extend({ nft: NftSchema })),
  version: z.number().int(),
})
export type Cart = z.infer<typeof CartSchema>

export const CouponStatusSchema = z.enum(['applied', 'invalid', 'expired'])

export const QuoteSchema = z.object({
  quoteId: z.string(),
  lines: z.array(
    z.object({
      nftId: z.string(),
      quantity: z.number().int(),
      unitPrice: EthSchema,
      lineTotal: EthSchema,
      available: z.boolean(),
    }),
  ),
  subtotal: EthSchema,
  discount: EthSchema,
  networkFee: EthSchema,
  total: EthSchema,
  coupon: z.object({ code: z.string(), status: CouponStatusSchema }).nullable(),
  expiresAt: z.string(),
})
export type Quote = z.infer<typeof QuoteSchema>

/*Pedidos*/
export const OrderStatusSchema = z.enum(['pending', 'confirmed', 'rejected'])
export type OrderStatus = z.infer<typeof OrderStatusSchema>

export const OrderSchema = z.object({
  id: z.string(),
  status: OrderStatusSchema,
  version: z.number().int(),
  walletId: z.string(),
  network: NetworkSchema,
  
  items: z.array(
    z.object({
      nftId: z.string(),
      name: z.string(),
      image: z.string(),
      quantity: z.number().int(),
      unitPrice: EthSchema,
    }),
  ),
  subtotal: EthSchema,
  discount: EthSchema,
  networkFee: EthSchema,
  total: EthSchema,
  txHash: z.string().nullable(),
  rejectionReason: z.string().nullable(),
  createdAt: z.string(),
})
export type Order = z.infer<typeof OrderSchema>

export const CreateOrderInputSchema = z.object({
  quoteId: z.string(),
  walletId: z.string(),
  network: NetworkSchema,
})
export type CreateOrderInput = z.infer<typeof CreateOrderInputSchema>

/*Eventos Socket.IO */
const BaseEventSchema = z.object({
  eventId: z.string(), // identidade estável (deduplicação)
  resourceId: z.string(),
  version: z.number().int(), // descarta eventos antigos
  occurredAt: z.string(),
})

export const NftUpdatedEventSchema = BaseEventSchema.extend({
  type: z.literal('nft.updated'),
  data: NftSchema,
})
export const OrderUpdatedEventSchema = BaseEventSchema.extend({
  type: z.literal('order.updated'),
  data: OrderSchema,
})
export type NftUpdatedEvent = z.infer<typeof NftUpdatedEventSchema>
export type OrderUpdatedEvent = z.infer<typeof OrderUpdatedEventSchema>