export interface RequestLog {

    id?: string;
    email?: string;
    branch?: string;
    finYear?: string;
    reqAt?: Date;
    respAt?: Date;
    baseUrl?: string;
    method?: string;
    path?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [prop: string]: any;
}
