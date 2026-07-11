// Run: node src/front/infinitepay.test.mjs
import assert from 'node:assert'
import { toCentsInt, buildCheckoutUrl } from './infinitepay.js'

assert.equal(toCentsInt('100,00'.replace(',', '.')), 10000)
assert.equal(toCentsInt(150.5), 15050)
assert.equal(toCentsInt(''), 0)
assert.equal(toCentsInt('0.1'), 10) // no float drift

const url = buildCheckoutUrl({
  handle: 'joao',
  items: [{ description: 'Presente', price: 10000, quantity: 1 }],
  orderNsu: 'abc-123',
  redirectUrl: 'https://ex.com/obrigado',
})
const u = new URL(url)
assert.equal(u.origin + u.pathname, 'https://checkout.infinitepay.io/joao')
assert.deepEqual(JSON.parse(u.searchParams.get('items')), [{ description: 'Presente', price: 10000, quantity: 1 }])
assert.equal(u.searchParams.get('order_nsu'), 'abc-123')
assert.equal(u.searchParams.get('redirect_url'), 'https://ex.com/obrigado')

console.log('ok')
