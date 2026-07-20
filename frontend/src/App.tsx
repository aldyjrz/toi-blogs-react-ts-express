import { Routes, Route } from 'react-router-dom';
import { BlogLayout } from '@/layouts/BlogLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { HomePage } from '@/pages/blog/HomePage';
import { BlogListPage } from '@/pages/blog/BlogListPage';
import { PostPage } from '@/pages/blog/PostPage';
import { CategoryPage } from '@/pages/blog/CategoryPage';
import { TagPage } from '@/pages/blog/TagPage';
import { AuthorPage } from '@/pages/blog/AuthorPage';
import { SearchPage } from '@/pages/blog/SearchPage';
import { PagePage } from '@/pages/blog/PagePage';
import { NotFoundPage } from '@/pages/blog/NotFoundPage';
import { LoginPage } from '@/pages/admin/LoginPage';
import { DashboardPage } from '@/pages/admin/DashboardPage';
import { AdminPostsPage } from '@/pages/admin/PostsPage';
import { AdminCategoriesPage } from '@/pages/admin/CategoriesPage';
import { AdminTagsPage } from '@/pages/admin/TagsPage';
import { AdminMediaPage } from '@/pages/admin/MediaPage';
import { AdminSettingsPage } from '@/pages/admin/SettingsPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export function App() {
  return (
    <Routes>
      <Route element={<BlogLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/category/:slug" element={<CategoryPage />} />
        <Route path="/blog/tag/:slug" element={<TagPage />} />
        <Route path="/blog/:slug" element={<PostPage />} />
        <Route path="/author/:id" element={<AuthorPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/:slug" element={<PagePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="/admin/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route path="/admin" element={<DashboardPage />} />
        <Route path="/admin/posts" element={<AdminPostsPage />} />
        <Route path="/admin/categories" element={<AdminCategoriesPage />} />
        <Route path="/admin/tags" element={<AdminTagsPage />} />
        <Route path="/admin/media" element={<AdminMediaPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
      </Route>
    </Routes>
  );
}
