export interface CartItemType {
    productId: string;
    productName: string;
    productPrice: number;
    quantity: number;
}

export default interface CartType {
    products: Record<string, CartItemType>;
    total: number;
}