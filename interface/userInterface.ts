export interface userRegistrationType {
    name: string | null;
    surname: string | null;
    email: string | null;
    phoneNumber: string | null;
    password: string | null;
}


export interface structuredUserType {
    email: string | null;
    password: string | null;
    name: string | null;
    surname: string | null;
    phoneNumber: number | null;
    gender_id: number | null;
    height: number | null;
    weight: number | null;
    birthDate: string | null;
    sportFrequecy: number | null;
}