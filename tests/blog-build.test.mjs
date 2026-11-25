import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { remarkMermaid } from '../src/utils/remark-mermaid.mjs';

function findMarkdownPosts(dir, baseDir = dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMarkdownPosts(full, baseDir));
    } else if (/\.(md|mdx)$/.test(entry.name)) {
      const content = fs.readFileSync(full, 'utf8');
      if (!/^draft:\s*true$/m.test(content)) {
        const id = path.relative(baseDir, full).replace(/\.(md|mdx)$/, '').split(path.sep).join('/');
        results.push({ id, content });
      }
    }
  }
  return results;
}

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

test('static dist output contains core pages, all category routes, and every published post', () => {
  const dist = path.resolve('dist');
  const coreFiles = [
    'index.html',
    'blog/index.html',
    'about/index.html',
    '404.html',
    'rss.xml',
    'sitemap-index.xml',
    'categories/system-design/index.html',
    'categories/cloud/index.html',
    'categories/cloud/aws/index.html',
    'categories/linux-networking/index.html',
    'categories/containers-k8s/index.html',
    'categories/iac-cicd/index.html',
    'categories/observability/index.html',
  ];

  for (const rel of coreFiles) {
    assert.ok(fs.existsSync(path.join(dist, rel)), `Missing built core file: ${rel}`);
  }

  const homeHtml = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
  assert.match(
    homeHtml,
    /href="\/james-blog\/blog"/,
    'Expected GitHub Pages /james-blog base path in navigation links',
  );

  const posts = findMarkdownPosts(path.resolve('src/content/blog'));
  for (const post of posts) {
    const builtPostPath = path.join(dist, 'blog', post.id, 'index.html');
    assert.ok(fs.existsSync(builtPostPath), `Missing built HTML for post: ${post.id}`);

    const postHtml = fs.readFileSync(builtPostPath, 'utf8');
    assert.match(postHtml, /mermaid-lightbox/, 'Expected zoom lightbox dialog in post HTML');

    if (/```mermaid/.test(post.content)) {
      assert.match(postHtml, /<pre class="mermaid/, `Expected Mermaid block in ${post.id}`);
    }
    if (/```(ts|js|json|python|bash|hcl|yaml)/.test(post.content)) {
      assert.match(postHtml, /expressive-code/, `Expected Expressive Code block in ${post.id}`);
    }
  }
});
