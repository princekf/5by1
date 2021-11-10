export interface ProfileUser {
    [attribute: string]: any;
    id: string;
    name: string;
    email: string;
    role: string;
    company?: string;
    branch?: string;
    finYear?: string;
  }
