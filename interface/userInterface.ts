export interface userType {
    name: string;
    surname: string;
    email: string;
    phoneNumber: string;
    password: string;
}


export interface structuredUserType {
    "email": string;
    "password": string;
    "name": string;
    "surname": string;
    "phoneNumber": number;
    "gender_id": number;
    "height": number;
    "weight": number;
    "birthDate": string;
    "sportFrequecy": number;
}