import type { Payload, PayloadRequest, File, RequiredDataFromCollectionSlug } from 'payload'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const text = (value: string) => ({ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: value, version: 1 })
const p = (value: string) => ({ type: 'paragraph', children: [text(value)], direction: 'ltr', format: '', indent: 0, textFormat: 0, textStyle: '', version: 1 })
const h = (value: string, tag = 'h2') => ({ type: 'heading', children: [text(value)], direction: 'ltr', format: '', indent: 0, tag, version: 1 })
const rich = (...children: object[]) => ({ root: { type: 'root', children, direction: 'ltr', format: '', indent: 0, version: 1 } })
type RichText = RequiredDataFromCollectionSlug<'posts'>['content']

const articles = [
  {
    slug: 'the-cardinal-at-the-feeder', title: 'The cardinal at the feeder', category: 'Backyard birds', image: 'cardinal.jpg', credit: 'Randy Mays',
    description: 'A flash of red can turn an ordinary winter morning into an observation worth keeping.',
    sections: [
      ['A familiar visitor', 'The northern cardinal is often the first bird people learn to recognize in eastern North America. The male is bright red, with a black mask and a short crest. The female is softer brown with warm red accents on the wings, tail and bill. Both have a strong, cone-shaped bill adapted to cracking seeds.'],
      ['Where to look', 'Cardinals often stay near dense shrubs and woodland edges. Watch the quiet routes between cover and a feeder, especially early in the morning. Their clear whistles can announce them before they appear. They do not migrate, so a familiar pair may brighten the same neighborhood through winter.'],
      ['Keep a useful note', 'Record the time, weather, behavior and nearby plants. Is the bird feeding on the ground or perched above it? Is it alone or calling to another cardinal? Repeated observations tell a richer story than a single photograph.'],
    ],
  },
  {
    slug: 'puffin-on-the-atlantic-edge', title: 'A puffin on the Atlantic edge', category: 'Coastal birds', image: 'puffin.jpg', credit: 'USFWS National Digital Library',
    description: 'Bright bill, dark sea, and a life shaped by the rhythm of the North Atlantic.',
    sections: [
      ['Made for sea and shore', 'The Atlantic puffin spends much of its life at sea and returns to coastal colonies to breed. Its compact body, dark upperparts and white face are easy to remember. Under water, its wings help it pursue small fish. A portrait on land hides how thoroughly this is a bird of the ocean.'],
      ['A seasonal transformation', 'The bill becomes especially colorful during the breeding season. Puffins nest in burrows or sheltered rock crevices, and adults carry fish back to their chicks. A beakful of fish is a vivid sight, but the long return trip through wind and waves is the larger story.'],
      ['Watch with care', 'Use established viewpoints and give nesting birds space. A colony that appears calm from afar can still be sensitive to people approaching a burrow. Binoculars let you notice arrivals and interactions without changing the behavior you came to see.'],
    ],
  },
  {
    slug: 'snowy-owl-open-landscape', title: 'The snowy owl and the open landscape', category: 'Birds of prey', image: 'snowy-owl.jpg', credit: 'Lisa Hupp / USFWS',
    description: 'Why this pale hunter belongs to wide horizons, patient watching, and careful distance.',
    sections: [
      ['Reading the habitat', 'A snowy owl on open tundra can be surprisingly hard to spot despite its pale plumage. Look for a low, upright shape on a rise or patch of bare ground. Plumage varies: many birds carry dark barring, and the brightest white individuals are only part of the story.'],
      ['Life in the open', 'The species breeds in the Arctic and can move south in some winters. It hunts in open country and relies on a landscape where movement is visible from far away. An owl may seem unbothered by a nearby observer, yet repeated approaches can interrupt resting or hunting.'],
      ['Leave room for the bird', 'A distant view is often the best one. Stay on public paths, avoid flushing the owl and never bait a wild bird for a photograph. Note its perch, the direction it watches and when it changes position.'],
    ],
  },
  {
    slug: 'stillness-of-the-great-blue-heron', title: 'The stillness of the great blue heron', category: 'Wetlands', image: 'heron.jpg', credit: 'George Gentry / USFWS',
    description: 'A patient wader shows how much can happen in a few quiet meters of wetland.',
    sections: [
      ['A deliberate hunter', 'The great blue heron can stand motionless at a marsh edge for minutes before striking. Its long legs let it move through shallow water; its neck folds into a compact S shape between actions. Fish are common prey, but the bird also takes other small animals.'],
      ['More than a silhouette', 'In flight, the neck is folded and the broad wings beat slowly. On the ground, the same bird looks tall and angular. Watching both postures is an easy way to learn its shape. Its presence also draws attention to the pools, reeds and fish that make up a wetland community.'],
      ['Try a ten-minute watch', 'Choose a spot with a clear view and stay still. Record where the heron stands, whether it moves with the waterline, and how often it attempts a catch. Small changes in depth or light can change its behavior.'],
    ],
  },
  {
    slug: 'the-robin-after-rain', title: 'The robin after rain', category: 'Backyard birds', image: 'robin.jpg', credit: 'Lee Karney / USFWS',
    description: 'The orange-breasted American robin rewards anyone who pauses after a shower.',
    sections: [
      ['On the lawn', 'American robins often run a short distance across a lawn, stop, and listen or look for food. Their orange breast and gray-brown back are familiar, yet their movements are just as useful for identification. After rain, damp soil can bring prey closer to the surface.'],
      ['Across the seasons', 'Robins use habitats from parks and gardens to woodland edges. Their diet changes through the year, with invertebrates important in warmer months and fruit playing a greater role at other times. The same bird can seem like a lawn specialist one week and a berry seeker another.'],
      ['What to write down', 'Watch where the robin pauses and what it collects. Compare a morning visit with one near dusk. A few dates and locations can show when local birds become more vocal, gather in groups or change feeding areas.'],
    ],
  },
] as const

async function localImage(name: string): Promise<File> {
  const data = await readFile(path.join(process.cwd(), 'public', 'birds', name))
  return { name, data, mimetype: 'image/jpeg', size: data.length }
}

export const seed = async ({ payload, req }: { payload: Payload; req: PayloadRequest }): Promise<void> => {
  payload.logger.info('Seeding Field Notes...')
  for (const collection of ['categories', 'media', 'pages', 'posts', 'forms', 'form-submissions', 'search'] as const) {
    await payload.db.deleteMany({ collection, req, where: {} })
    if (payload.collections[collection].config.versions) await payload.db.deleteVersions({ collection, req, where: {} })
  }
  const categories: Record<string, number> = {}
  for (const title of ['Backyard birds', 'Coastal birds', 'Birds of prey', 'Wetlands']) {
    const doc = await payload.create({ collection: 'categories', data: { title, slug: title.toLowerCase().replaceAll(' ', '-') }, overrideAccess: true })
    categories[title] = doc.id
  }
  const images: Record<string, number> = {}
  for (const article of articles) {
    const doc = await payload.create({ collection: 'media', data: { alt: article.title }, file: await localImage(article.image), overrideAccess: true })
    images[article.image] = doc.id
  }
  const posts: number[] = []
  for (const [index, article] of articles.entries()) {
    const content = rich(p(article.description), ...article.sections.flatMap(([title, body]) => [h(title), p(body)]), p('Photo: ' + article.credit + '. Public domain via USFWS; source details are on the Photo credits page.'))
    const doc = await payload.create({ collection: 'posts', data: {
      title: article.title, slug: article.slug, _status: 'published',
      heroImage: images[article.image], categories: [categories[article.category]],
      content: content as unknown as RichText, publishedAt: new Date(Date.UTC(2026, 8, 15 - index)).toISOString(),
      meta: { title: article.title + ' | Field Notes', description: article.description, image: images[article.image] },
    }, depth: 0, context: { disableRevalidate: true }, overrideAccess: true })
    posts.push(doc.id)
  }
  for (const id of posts) await payload.update({ collection: 'posts', id, data: { relatedPosts: posts.filter((other) => other !== id).slice(0, 2) }, context: { disableRevalidate: true }, overrideAccess: true })

  await payload.create({ collection: 'pages', data: {
    title: 'Home', slug: 'home', _status: 'published',
    hero: { type: 'highImpact', media: images['heron.jpg'], richText: rich(h('Look closer at the birds around us', 'h1'), p('Field Notes is an independent journal for curious birdwatchers. Follow familiar species through coast, wetland, garden and tundra.')) as unknown as RichText, links: [{ link: { type: 'custom', label: 'Read the field notes', url: '/posts', appearance: 'default' } }] },
    layout: [{ blockType: 'archive', introContent: rich(h('Latest field notes'), p('Patient stories and the small details that make each bird memorable.')) as unknown as RichText, populateBy: 'collection', relationTo: 'posts', limit: 6 }],
    meta: { title: 'Field Notes — A birdwatching journal', description: 'Stories and field guides about birds, habitats and patient observation.', image: images['heron.jpg'] },
  }, context: { disableRevalidate: true }, overrideAccess: true })
  await payload.updateGlobal({ slug: 'header', data: { navItems: [{ link: { type: 'custom', label: 'Stories', url: '/posts' } }] }, context: { disableRevalidate: true }, overrideAccess: true })
  await payload.updateGlobal({ slug: 'footer', data: { navItems: [{ link: { type: 'custom', label: 'Photo credits', url: '/credits' } }, { link: { type: 'custom', label: 'CMS', url: '/admin' } }] }, context: { disableRevalidate: true }, overrideAccess: true })
  payload.logger.info('Seeded five articles and five public-domain photos.')
}
