
export interface Save {

    files: {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
    }[];
    fields: string;
}
