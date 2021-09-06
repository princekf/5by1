export interface UserS {
    name: string;
    email?: string;
    password?: string;
}
export interface User extends UserS {
    id?: string;
}
