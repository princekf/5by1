export interface UnitS {
    name: string;
    code: string;
    // Id of parent unit if any
    parent?: string;
    // How many parent unit is this unit. Eg - One kilogram is 1000 millie gram
    times?: number;
    // How many decimal places are allowed - It depends on times
    decimalPlaces?: number;
}

export interface Unit extends UnitS {
    _id?: string;
}
