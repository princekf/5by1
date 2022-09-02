export interface QueryData {
    offset?: number;
    limit?: number;
    skip?: number;
    order?: Array<string>;
    fields?: Record<string, boolean>;
    where?: Record<string, unknown>;
    include?: Array<Record<string, unknown>> | string[];
}
