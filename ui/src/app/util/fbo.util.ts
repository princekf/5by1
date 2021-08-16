export const findColumnValue = (element:unknown, column:string):string => <string> column.split('.').reduce((acc, cur) => acc[cur] ?? '', element);
