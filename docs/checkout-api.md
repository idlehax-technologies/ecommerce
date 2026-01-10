Endpoint: POST /api/checkout

Request:
items: productId, vendorId, quantity
total
currency

Response:
success: boolean
orderId? (on success)
errorCode? (on failure)

Meaning of:
success
orderAttempted
orderPlaced