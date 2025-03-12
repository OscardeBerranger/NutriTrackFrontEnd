export interface CartItemType{
    "productId": string,
    "productName": string,
    "productPrice": number,
    "quantity": number
}

export default interface CartType {
    "products": Array<CartItemType>,
    "total": number
}