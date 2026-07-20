export interface JwtPayload {
  sub: string;
  role: string;
  tokenType: 'access' | 'refresh';
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  pagination: Pagination;
}
