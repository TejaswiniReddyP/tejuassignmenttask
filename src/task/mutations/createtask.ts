import { resolver } from "@blitzjs/rpc"
import { Ctx } from "blitz"
import db from "db"

import { z } from "zod"

const CreateTaskInput = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  description: z.string().optional(),
  status: z.string().default("Backlog"),
  isActive: z.boolean().default(true),
  createdBy: z.string().default("sysadmin"),
  updatedBy: z.string().default("sysadmin"),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export default resolver.pipe(resolver.zod(CreateTaskInput), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const task = await db.task.create({
    data: input,
  })

  return task
})
