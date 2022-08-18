export interface MenuNode {
    path: string;
    name: string;
    icon?: string;
    pKey?: string;
    noShow?: boolean;
    children?: MenuNode[];
  }
