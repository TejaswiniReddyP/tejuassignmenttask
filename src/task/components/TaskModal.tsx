import React from "react"
import {
  Modal,
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material"
import { useMutation } from "@blitzjs/rpc"
import createtask from "../mutations/createtask"

const TaskModal = ({
  visible,
  task,
  onClose,
  onCreate,
  onUpdate,
  taskName,
  setTaskName,
  taskType,
  setTaskType,
  taskDescription,
  setTaskDescription,
  taskStatus,
  setTaskStatus,
}) => {
  const [createTaskMut] = useMutation(createtask)
  const taskTypes = ["Bug", "Feature", "Task"]
  const statuses = [
    "Backlog",
    "To Do",
    "In Progress",
    "Ready for Review",
    "Back from Review",
    "Completed",
  ]

  const handleSubmit = async () => {
    const taskData = {
      name: taskName,
      type: taskType,
      description: taskDescription,
      status: taskStatus,
    }
    if (task) {
      onUpdate(taskData)
    } else {
      const task = onCreate(taskData)
      await createTaskMut(task)
    }
  }

  return (
    <Modal open={visible} onClose={onClose}>
      <Box
        sx={{
          width: 400,
          margin: "auto",
          padding: "20px",
          backgroundColor: "white",
          borderRadius: "8px",
        }}
      >
        <h2>{task ? "Edit Task" : "Create New Task"}</h2>

        <TextField
          label="Task Name"
          fullWidth
          margin="normal"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Task Type</InputLabel>
          <Select value={taskType} onChange={(e) => setTaskType(e.target.value)} label="Task Type">
            {taskTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Description"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select value={taskStatus} onChange={(e) => setTaskStatus(e.target.value)} label="Status">
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
          {task ? "Update Task" : "Create Task"}
        </Button>
      </Box>
    </Modal>
  )
}

export default TaskModal
