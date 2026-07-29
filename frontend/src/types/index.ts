export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  bio?: string;
  avatarUrl?: string;
}

export interface Author {
  id: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
}

export interface CategoryRef {
  id: string;
  name: string;
  slug: string;
}

export interface TagRef {
  id: string;
  name: string;
  slug: string;
}

export interface Seo {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  robots?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  authorName?: string;
  status: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  htmlContent?: string;
  featuredImage?: string;
  status: string;
  publishedAt?: string;
  createdAt?: string;
  readingTime: number;
  viewCount?: number;
  author: Author;
  category?: CategoryRef;
  postTags: { tag: TagRef }[];
  seo?: Seo;
  comments?: Comment[];
}

export interface Paginated<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: User;
}
