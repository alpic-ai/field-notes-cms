import 'dotenv/config'
import assert from 'node:assert/strict'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })
try {
  const [posts, categories, media, pages] = await Promise.all([
    payload.find({ collection: 'posts', limit: 20, overrideAccess: false }),
    payload.find({ collection: 'categories', limit: 20, overrideAccess: false }),
    payload.find({ collection: 'media', limit: 20, overrideAccess: false }),
    payload.find({ collection: 'pages', limit: 20, overrideAccess: false }),
  ])
  assert.equal(posts.totalDocs, 5)
  assert.equal(categories.totalDocs, 4)
  assert.equal(media.totalDocs, 5)
  assert.ok(pages.docs.some((page) => page.slug === 'home'))
  assert.ok(posts.docs.every((post) => post.heroImage && post.content && post._status === 'published'))
  console.log('Smoke test passed: five published articles, four categories, five photos and homepage.')
} finally {
  await payload.destroy()
}
