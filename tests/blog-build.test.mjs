import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { remarkMermaid } from '../src/utils/remark-mermaid.mjs';

test('remarkMermaid converts mermaid code block into pre.mermaid wrapper', () => {
  const tree = {
    type: 'root',
    children: [
      { type: 'code', lang: 'mermaid', value: 'flowchart LR\n  A --> B' },
      { type: 'code', lang: 'ts', value: 'const x = 1;' },
    ],
  };

  remarkMermaid()(tree);
  assert.equal(tree.children[0].type, 'html');
  assert.match(tree.children[0].value, /<pre class="mermaid/);
  assert.match(tree.children[0].value, /A --&gt; B/);
  assert.equal(tree.children[1].type, 'code');
});

test('static dist output contains Cloud Engineer categories, subcategories, posts, and empty state', () => {
  const dist = path.resolve('dist');
  const expectedFiles = [
    'index.html',
    'blog/index.html',
    'about/index.html',
    '404.html',
    'rss.xml',
    'sitemap-index.xml',
    'blog/system-design/scalability/thiet-ke-token-bucket-rate-limiter/index.html',
    'blog/cloud/other/toi-uu-hieu-nang-blog-ky-thuat-voi-astro-7/index.html',
    'categories/system-design/index.html',
    'categories/system-design/scalability/index.html',
    'categories/cloud/index.html',
    'categories/cloud/aws/index.html',
    'categories/observability/monitoring-metrics/index.html',
    'tags/he-thong/index.html',
  ];

  for (const rel of expectedFiles) {
    assert.ok(fs.existsSync(path.join(dist, rel)), `Missing built file: ${rel}`);
  }

  const postHtml = fs.readFileSync(
    path.join(dist, 'blog/system-design/scalability/thiet-ke-token-bucket-rate-limiter/index.html'),
    'utf8',
  );
  assert.match(postHtml, /expressive-code/, 'Expected Expressive Code block in post HTML');
  assert.match(postHtml, /class="katex"/, 'Expected build-time KaTeX math in post HTML');
  assert.match(postHtml, /<pre class="mermaid/, 'Expected Mermaid block in post HTML');
  assert.match(postHtml, /System Design/, 'Expected category breadcrumb in post HTML');
  assert.match(postHtml, /Scalability/, 'Expected subcategory breadcrumb in post HTML');

  assert.match(postHtml, /mermaid-lightbox/, 'Expected Mermaid zoom lightbox dialog in post HTML');

  const emptySubHtml = fs.readFileSync(
    path.join(dist, 'categories/cloud/azure/index.html'),
    'utf8',
  );
  assert.match(emptySubHtml, /Đang cập nhật bài viết đầu tiên/, 'Expected empty category notice');
});
