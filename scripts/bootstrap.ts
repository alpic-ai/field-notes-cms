import 'dotenv/config'
import { createLocalReq, getPayload } from 'payload'
import config from '../src/payload.config'
import { seed } from '../src/endpoints/seed'

const payload = await getPayload({ config })

try {
  const { totalDocs } = await payload.count({ collection: 'posts', overrideAccess: true })

  if (totalDocs === 0) {
    const req = await createLocalReq({}, payload)
    await seed({ payload, req })
  } else {
    payload.logger.info(`Field Notes has ${totalDocs} posts; skipping initial seed.`)
  }
} finally {
  await payload.destroy()
}
