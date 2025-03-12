import ingredientType from "./ingredientInterface"
import restaurantType from "./restaurantInterface"

export default interface productType {
    "id": number,
    "ingredients": Array<ingredientType>[],
    "calories": number,
    "price": number,
    "name": string,
    "origin": string,
    "restaurant": restaurantType
}