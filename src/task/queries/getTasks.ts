import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

export default resolver.pipe(resolver.authorize(), async () => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  let tasksData = await db.task.findMany({})

  return {
    tasksData,
  }
})
