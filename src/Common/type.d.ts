interface GetAllQuery {
  limit?: number;
  offset?: number;
  domain?: any;
  sort?: string;
  fields?: string[];
  include?: string[];
}
