export interface Unit {
    _id?: string;
    name: string;
    code: string;
    // Parent unit if any
    parent?: Unit;
    // How many parent unit is this unit. Eg - One kilogram is 1000 millie gram
    times?: number;
    // How many decimal places are allowed - It depends on times
    decimalPlaces?: number;
}
