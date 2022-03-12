export interface ListQueryRespType<Type> {
    totalItems: number,
    pageIndex: number,
    items: Array<Type>,
}
