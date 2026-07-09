// InfinityPay checkout link builder. Pure functions — see infinitepay.test.mjs.
// Docs format: https://checkout.infinitepay.io/{handle}?items=<json>&order_nsu=<id>&redirect_url=<url>
// Prices are integer cents.

export function toCentsInt(reais) {
  return Math.round((parseFloat(reais) || 0) * 100)
}

export function buildCheckoutUrl({ handle, items, orderNsu, redirectUrl }) {
  const params = new URLSearchParams({
    items: JSON.stringify(items),
    order_nsu: orderNsu,
    redirect_url: redirectUrl,
  })
  return `https://checkout.infinitepay.io/${handle}?${params}`
}
