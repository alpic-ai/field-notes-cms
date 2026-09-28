import Link from 'next/link'

const photos = [
  ['Northern cardinal', 'Randy Mays', 'https://www.fws.gov/media/northern-cardinal-9'],
  ['Atlantic puffin', 'USFWS National Digital Library', 'https://www.fws.gov/media/atlantic-puffin-2'],
  ['Snowy owl', 'Lisa Hupp / USFWS', 'https://www.fws.gov/media/snowy-owl-bubo-scandiacus'],
  ['Great blue heron', 'George Gentry / USFWS', 'https://www.fws.gov/media/great-blue-heron-4'],
  ['American robin', 'Lee Karney / USFWS', 'https://www.fws.gov/media/american-robin-2'],
]

export const metadata = { title: 'Photo credits | Field Notes' }

export default function Credits() {
  return <main className="container max-w-3xl py-24 prose dark:prose-invert">
    <h1>Photo credits</h1>
    <p>Every photograph in this demo is marked Public Domain by the U.S. Fish & Wildlife Service. We keep the source and photographer visible so you can check each image yourself.</p>
    <ul>{photos.map(([subject, credit, url]) => <li key={url}><Link href={url}>{subject}</Link> — {credit}</li>)}</ul>
  </main>
}
