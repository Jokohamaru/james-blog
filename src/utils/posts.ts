import { getCollection, type CollectionEntry } from 'astro:content';
import { findCategory, findSubcategory, type CategoryDef, type SubcategoryDef } from '@/categories';

export type BlogPost = CollectionEntry<'blog'>;

export interface PostTaxonomy {
  category?: CategoryDef;
  subcategory?: SubcategoryDef;
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog', ({ data }) => {
    return import.meta.env.PROD ? !data.draft : true;
  });
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/**
 * Suy ra danh mục và nhánh con trực tiếp từ đường dẫn thư mục vật lý trong src/content/blog/:
 * - `cloud/aws/bai-viet` -> category: `cloud`, subcategory: `aws`
 * - `system-design/bai-viet` -> category: `system-design`, subcategory: undefined
 */
export function getPostTaxonomy(postId: string): PostTaxonomy {
  const parts = postId.split('/');
  if (parts.length < 2) return {};
  const category = findCategory(parts[0]);
  if (!category) return {};
  const subcategory = parts.length >= 3 ? findSubcategory(category.slug, parts[1]) : undefined;
  return { category, subcategory };
}

// shortcut: đếm từ theo khoảng trắng (~220 từ/phút), nâng cấp nếu nhúng nhiều component MDX phức tạp
export function estimateReadingTime(body = ''): number {
  const plain = body.replace(/```[\s\S]*?```/g, ' ').replace(/[#>*_`~\[\]()]/g, ' ');
  const words = plain.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function formatDateVi(date: Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function slugifyTag(tag: string): string {
  return tag
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
