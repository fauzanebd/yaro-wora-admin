import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash2, Calendar } from "lucide-react";
import NewsContentDialog from "@/components/NewsContentDialog";
import NewsCategoryDialog from "@/components/NewsCategoryDialog";
import NewsAuthorDialog from "@/components/NewsAuthorDialog";
import NewsDialog from "@/components/NewsDialog";
import {
  useNewsContent,
  useUpdateNewsContent,
  useNewsCategories,
  useCreateNewsCategory,
  useUpdateNewsCategory,
  useDeleteNewsCategory,
  useNewsAuthors,
  useCreateNewsAuthor,
  useUpdateNewsAuthor,
  useDeleteNewsAuthor,
  useNews,
  useNewsArticle,
  useCreateNewsArticle,
  useUpdateNewsArticle,
  useDeleteNewsArticle,
} from "@/hooks/useApi";
import type { NewsCategory, NewsAuthor, NewsPageContent } from "@/types/api";
import type { NewsContentForm } from "@/types/news-content-form";
import type { NewsCategoryForm } from "@/types/news-category-form";
import type { NewsAuthorForm } from "@/types/news-author-form";
import type { NewsForm } from "@/types/news-form";

export default function NewsPage() {
  // Dialog states
  const [isContentDialogOpen, setIsContentDialogOpen] = React.useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = React.useState(false);
  const [isAuthorDialogOpen, setIsAuthorDialogOpen] = React.useState(false);
  const [isArticleDialogOpen, setIsArticleDialogOpen] = React.useState(false);

  // Editing states
  const [editingCategory, setEditingCategory] =
    React.useState<NewsCategory | null>(null);
  const [editingAuthor, setEditingAuthor] = React.useState<NewsAuthor | null>(
    null
  );
  const [editingArticleId, setEditingArticleId] = React.useState<number | null>(
    null
  );

  // Pagination
  const [page, setPage] = React.useState(1);
  const [perPage] = React.useState(10);

  // Queries
  const {
    data: content,
    isLoading: contentLoading,
    error: contentError,
  } = useNewsContent();

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useNewsCategories();

  const {
    data: authors,
    isLoading: authorsLoading,
    error: authorsError,
  } = useNewsAuthors();

  const {
    data: newsResp,
    isLoading: newsLoading,
    error: newsError,
  } = useNews({ page, per_page: perPage });

  const articles = newsResp?.data || [];
  const pagination = newsResp?.meta?.pagination;

  // Fetch full article when editing
  const { data: editingArticle } = useNewsArticle(editingArticleId || 0, {
    enabled: !!editingArticleId,
  });

  // Mutations
  const updateContent = useUpdateNewsContent();
  const createCategory = useCreateNewsCategory();
  const updateCategory = useUpdateNewsCategory();
  const deleteCategory = useDeleteNewsCategory();
  const createAuthor = useCreateNewsAuthor();
  const updateAuthor = useUpdateNewsAuthor();
  const deleteAuthor = useDeleteNewsAuthor();
  const createArticle = useCreateNewsArticle();
  const updateArticle = useUpdateNewsArticle();
  const deleteArticle = useDeleteNewsArticle();

  // Content handlers
  const handleContentSubmit = async (data: NewsContentForm) => {
    const submission: NewsPageContent = {
      ...data,
      id: content?.id || 0,
      hero_image_url: data.hero_image_url || "",
      hero_image_thumbnail_url:
        data.hero_image_thumbnail_url &&
        data.hero_image_thumbnail_url.length > 0
          ? data.hero_image_thumbnail_url
          : undefined,
      created_at: content?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as NewsPageContent;
    try {
      await updateContent.mutateAsync(submission);
      setIsContentDialogOpen(false);
    } catch (e) {
      console.error(e);
      alert("Failed to save news content");
    }
  };

  // Category handlers
  const openCreateCategory = () => {
    setEditingCategory(null);
    setIsCategoryDialogOpen(true);
  };

  const openEditCategory = (cat: NewsCategory) => {
    setEditingCategory(cat);
    setIsCategoryDialogOpen(true);
  };

  const handleCategorySubmit = async (data: NewsCategoryForm) => {
    try {
      if (editingCategory && editingCategory.id) {
        await updateCategory.mutateAsync({
          id: editingCategory.id,
          payload: data,
        });
      } else {
        await createCategory.mutateAsync(data);
      }
      setIsCategoryDialogOpen(false);
      setEditingCategory(null);
    } catch (e) {
      console.error("Failed to save category", e);
      alert("Failed to save category");
    }
  };

  const handleDeleteCategory = async (id?: number) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory.mutateAsync(id);
    } catch (e) {
      console.error("Failed to delete category", e);
      alert("Failed to delete category");
    }
  };

  // Author handlers
  const openCreateAuthor = () => {
    setEditingAuthor(null);
    setIsAuthorDialogOpen(true);
  };

  const openEditAuthor = (author: NewsAuthor) => {
    setEditingAuthor(author);
    setIsAuthorDialogOpen(true);
  };

  const handleAuthorSubmit = async (data: NewsAuthorForm) => {
    try {
      if (editingAuthor && editingAuthor.id) {
        await updateAuthor.mutateAsync({
          id: editingAuthor.id,
          payload: data,
        });
      } else {
        await createAuthor.mutateAsync(data);
      }
      setIsAuthorDialogOpen(false);
      setEditingAuthor(null);
    } catch (e) {
      console.error("Failed to save author", e);
      alert("Failed to save author");
    }
  };

  const handleDeleteAuthor = async (id: number) => {
    if (!confirm("Are you sure you want to delete this author?")) return;
    try {
      await deleteAuthor.mutateAsync(id);
    } catch (e) {
      console.error("Failed to delete author", e);
      alert("Failed to delete author");
    }
  };

  // Article handlers
  const openCreateArticle = () => {
    setEditingArticleId(null);
    setIsArticleDialogOpen(true);
  };

  const openEditArticle = (article: { id: number }) => {
    setEditingArticleId(article.id);
    setIsArticleDialogOpen(true);
  };

  const handleArticleSubmit = async (data: NewsForm) => {
    try {
      if (editingArticleId) {
        await updateArticle.mutateAsync({
          id: editingArticleId,
          payload: data,
        });
      } else {
        await createArticle.mutateAsync(data);
      }
      setIsArticleDialogOpen(false);
      setEditingArticleId(null);
    } catch (e) {
      console.error("Failed to save article", e);
      alert("Failed to save article");
    }
  };

  const handleDeleteArticle = async (id: number) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      await deleteArticle.mutateAsync(id);
    } catch (e) {
      console.error("Failed to delete article", e);
      alert("Failed to delete article");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">News Management</h1>
          <p className="text-muted-foreground">
            Manage news page content, articles, categories and authors
          </p>
        </div>
      </div>

      {/* Page Content Overview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Page Content</CardTitle>
              <CardDescription>
                Manage header, title, subtitle and highlight sections
              </CardDescription>
            </div>
            <NewsContentDialog
              open={isContentDialogOpen}
              onOpenChange={setIsContentDialogOpen}
              content={content || null}
              onSubmit={handleContentSubmit}
              trigger={
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Content
                </Button>
              }
            />
          </div>
        </CardHeader>
        <CardContent>
          {contentLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : contentError ? (
            <div className="text-center py-8">
              <p className="text-destructive font-medium mb-2">
                Failed to load content
              </p>
              <p className="text-sm text-muted-foreground">
                {contentError instanceof Error
                  ? contentError.message
                  : "Unknown error"}
              </p>
            </div>
          ) : content ? (
            <div className="space-y-4">
              {content.hero_image_url && (
                <img
                  src={content.hero_image_url}
                  alt="Hero"
                  className="w-full h-48 object-cover rounded-md"
                />
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">
                    Title (EN)
                  </h3>
                  <p className="text-lg">{content.title}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">
                    Title (ID)
                  </h3>
                  <p className="text-lg">{content.title_id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">
                    Subtitle (EN)
                  </h3>
                  <p className="text-sm">{content.subtitle}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">
                    Subtitle (ID)
                  </h3>
                  <p className="text-sm">{content.subtitle_id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">
                    Highlight Title (EN)
                  </h3>
                  <p className="text-sm">{content.highlight_section_title}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">
                    Highlight Title (ID)
                  </h3>
                  <p className="text-sm">
                    {content.highlight_section_title_id}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No content found. Click "Edit Content" to add content.
            </div>
          )}
        </CardContent>
      </Card>

      {/* News Articles Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>News Articles</CardTitle>
              <CardDescription>
                Manage news articles and their content
              </CardDescription>
            </div>
            <NewsDialog
              open={isArticleDialogOpen}
              onOpenChange={setIsArticleDialogOpen}
              editingArticle={editingArticle || null}
              onSubmit={handleArticleSubmit}
              trigger={
                <Button onClick={openCreateArticle}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Article
                </Button>
              }
            />
          </div>
        </CardHeader>
        <CardContent>
          {newsLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : newsError ? (
            <div className="text-center py-8">
              <p className="text-destructive font-medium mb-2">
                Failed to load articles
              </p>
              <p className="text-sm text-muted-foreground">
                {newsError instanceof Error
                  ? newsError.message
                  : "Unknown error"}
              </p>
            </div>
          ) : !articles || articles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No articles found. Click "Add Article" to create one.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Read Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{article.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {article.excerpt}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            article.news_author.avatar ||
                            "/api/placeholder/24/24"
                          }
                          alt={article.news_author.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-sm">
                          {article.news_author.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {article.news_category.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span className="text-sm">
                          {formatDate(article.date_published)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {article.is_headline ? (
                        <Badge>Headline</Badge>
                      ) : (
                        <Badge variant="secondary">Regular</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{article.read_time} min</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditArticle(article)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteArticle(article.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Page {pagination?.current_page ?? page} of{" "}
              {pagination?.total_pages ?? 1}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={!(pagination?.has_previous ?? page > 1)}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={!(pagination?.has_next ?? false)}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>News Categories</CardTitle>
              <CardDescription>
                Manage categories for news articles
              </CardDescription>
            </div>
            <NewsCategoryDialog
              open={isCategoryDialogOpen}
              onOpenChange={setIsCategoryDialogOpen}
              category={editingCategory}
              onSubmit={handleCategorySubmit}
              title={editingCategory ? "Edit Category" : "Add Category"}
              trigger={
                <Button onClick={openCreateCategory}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              }
            />
          </div>
        </CardHeader>
        <CardContent>
          {categoriesLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : categoriesError ? (
            <div className="text-center py-8">
              <p className="text-destructive font-medium mb-2">
                Failed to load categories
              </p>
              <p className="text-sm text-muted-foreground">
                {categoriesError instanceof Error
                  ? categoriesError.message
                  : "Unknown error"}
              </p>
            </div>
          ) : !categories || categories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No categories found. Click "Add Category" to create your first
              category.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Name (ID)</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Articles</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.id || cat.name}>
                    <TableCell className="font-medium">{cat.name}</TableCell>
                    <TableCell>{cat.name_id}</TableCell>
                    <TableCell>
                      {cat.description ? (
                        <div className="max-w-xs truncate">
                          {cat.description}
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{cat.count}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditCategory(cat)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteCategory(cat.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Authors Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>News Authors</CardTitle>
              <CardDescription>
                Manage authors for news articles
              </CardDescription>
            </div>
            <NewsAuthorDialog
              open={isAuthorDialogOpen}
              onOpenChange={setIsAuthorDialogOpen}
              author={editingAuthor}
              onSubmit={handleAuthorSubmit}
              title={editingAuthor ? "Edit Author" : "Add Author"}
              trigger={
                <Button onClick={openCreateAuthor}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Author
                </Button>
              }
            />
          </div>
        </CardHeader>
        <CardContent>
          {authorsLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : authorsError ? (
            <div className="text-center py-8">
              <p className="text-destructive font-medium mb-2">
                Failed to load authors
              </p>
              <p className="text-sm text-muted-foreground">
                {authorsError instanceof Error
                  ? authorsError.message
                  : "Unknown error"}
              </p>
            </div>
          ) : !authors || authors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No authors found. Click "Add Author" to create your first author.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Author</TableHead>
                  <TableHead>Articles</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {authors.map((author) => (
                  <TableRow key={author.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={author.avatar || "/api/placeholder/40/40"}
                          alt={author.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="font-medium">{author.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{author.count}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditAuthor(author)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteAuthor(author.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
