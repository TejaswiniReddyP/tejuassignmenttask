import { resolver } from "@blitzjs/rpc"
import { Ctx } from "blitz"
import db from "db"

import { z } from "zod"

// Define input validation schema (for task deletion, we only need the task ID)
const DeleteTaskInput = z.object({
  taskId: z.string(),
})

export default resolver.pipe(
  resolver.zod(DeleteTaskInput),
  resolver.authorize(),
  async ({ taskId }: { taskId: string }, ctx: Ctx) => {
    // You can add authorization checks here if necessary

    try {
      // Perform the deletion of the task
      const deletedTask = await db.task.delete({
        where: { id: taskId },
      })

      return deletedTask // Optionally return the deleted task for confirmation
    } catch (error) {
      // Handle any errors that occur during deletion
      throw new Error("Error deleting task: " + error.message)
    }
  }
)
