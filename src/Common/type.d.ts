interface GetAllQuery {
  limit?: number;
  offset?: number;
  domain?: any;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
  fields?: string[];
  include?: string[];
}
