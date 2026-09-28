import 'dotenv/config'
import { createLocalReq, getPayload } from 'payload'
import config from '../src/payload.config'
import { seed } from '../src/endpoints/seed'

const payload = await getPayload({ config })
try {
  const req = await createLocalReq({}, payload)
  await seed({ payload, req })
  console.log('Field Notes content is ready.')
} finally {
  await payload.destroy()
}
