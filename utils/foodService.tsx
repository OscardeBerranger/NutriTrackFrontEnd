import {baseUrl} from "@/constants/globalVariable";
import productType from "@/interface/productInterface";

export async function getProducts(token: string | null) {
    if (token){
        try {
            let response = await fetch(`${baseUrl}/api/product/all`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
            const data = await response.json();
            return data.map((plate: any) => ({
                id: plate.id,
                name: plate.name,
                calories: plate.calories,
                price: plate.price,
                origin: plate.origin,
                ingredients: plate.ingredients.map((ingredient: any) => ({
                    id: ingredient.id,
                    name: ingredient.name
                })),
                restaurant: {
                    id: plate.restaurant.id,
                    address: {
                        streetNumber: plate.restaurant.Address.streetNumber,
                        street: plate.restaurant.Address.street,
                        zipcode: plate.restaurant.Address.zipcode,
                        city: plate.restaurant.Address.city,
                        country: plate.restaurant.Address.country
                    }
                }
            }));
        }
        catch (error) {
            console.log(error)
        }
    }
}