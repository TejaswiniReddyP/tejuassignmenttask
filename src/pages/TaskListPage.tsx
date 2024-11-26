import React, { useState, useEffect } from "react"
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Modal,
  Box,
  TextField,
} from "@mui/material"
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material"
import createtask from "src/task/mutations/createtask"
import { useMutation, useQuery } from "@blitzjs/rpc"
import TaskModal from "src/task/components/TaskModal"
import getTasks from "src/task/queries/getTasks"
import updatetask from "src/task/mutations/updatetask"
import deletetask from "src/task/mutations/deletetask"

const TaskListPage = () => {
  const [createTaskMut] = useMutation(createtask)
  const [updateTaskMut] = useMutation(updatetask)
  const [deleteTaskMut] = useMutation(deletetask)
  const [{ tasksData }] = useQuery(getTasks, {})
  const [tasks, setTasks] = useState<any>(tasksData || []) // Initialize with tasksData from the API
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentTask, setCurrentTask] = useState<any>()
  const [statusFilter, setStatusFilter] = useState("All")
  const [taskName, setTaskName] = useState("")
  const [taskType, setTaskType] = useState("Bug")
  const [taskDescription, setTaskDescription] = useState("")
  const [taskStatus, setTaskStatus] = useState("Backlog")

  const taskTypes = ["Bug", "Feature", "Task"]
  const statuses = [
    "Backlog",
    "To Do",
    "In Progress",
    "Ready for Review",
    "Back from Review",
    "Completed",
  ]

  // Update tasks based on status filter
  useEffect(() => {
    setTasks(tasksData.filter((task) => statusFilter === "All" || task.status === statusFilter))
  }, [statusFilter, tasksData])

  const handleCreateTask = async () => {
    const task = {
      id: `task-id-${tasksData.length + 1}`,
      name: taskName,
      type: taskType,
      description: taskDescription,
      status: taskStatus,
      createdBy: "sysadmin",
      updatedBy: "sysadmin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    try {
      await createTaskMut(task)

      setTasks([...tasks, task])

      setIsModalVisible(false)
    } catch (error) {
      console.error("Error creating task:", error)
      // Optionally, show an error message to the user (you can use an alert or a UI message)
    }
  }

  const handleUpdateTask = async () => {
    // Prepare the updated task data
    const updatedTask = {
      id: currentTask.id,
      name: taskName,
      type: taskType,
      description: taskDescription,
      status: taskStatus,
      updatedBy: "sysadmin",
      updatedAt: new Date().toISOString(),
    }

    try {
      await updateTaskMut(updatedTask)

      setTasks(
        tasks.map((task) => (task.id === currentTask.id ? { ...task, ...updatedTask } : task))
      )

      setIsModalVisible(false)
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      // Call the delete task mutation
      await deleteTaskMut({ taskId })

      // Update the local state by filtering out the deleted task
      setTasks(tasks.filter((task) => task.id !== taskId))
    } catch (error) {
      console.error("Error deleting task:", error)
      // Optionally show an error message to the user
    }
  }

  const handleOpenModal = (task: any = null) => {
    setCurrentTask(task)
    setTaskName(task ? task.name : "")
    setTaskType(task ? task.type : "Bug")
    setTaskDescription(task ? task.description : "")
    setTaskStatus(task ? task.status : "Backlog")
    setIsModalVisible(true)
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
  }

  const columns = [
    { title: "ID", field: "id" },
    { title: "Task Name", field: "name" },
    { title: "Description", field: "description" },
    { title: "Task Type", field: "type" },
    { title: "Status", field: "status" },
    { title: "Created By", field: "createdBy" },
    { title: "Created Date", field: "createdAt" },
    { title: "Updated By", field: "updatedBy" },
    { title: "Updated Date", field: "updatedAt" },
    { title: "Actions", field: "actions" },
  ]

  return (
    <div>
      <h1>Task Management</h1>

      <div style={{ marginBottom: "20px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenModal()}
          startIcon={<AddIcon />}
        >
          + New Task
        </Button>
        <FormControl style={{ marginLeft: "10px" }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status"
          >
            <MenuItem value="All">All</MenuItem>
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  sx={{ backgroundColor: "blue", color: "white", fontWeight: "bold" }}
                >
                  {column.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.id}</TableCell>
                <TableCell>{task.name}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{task.type}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{task.createdBy}</TableCell>
                <TableCell>{new Date(task.createdAt).toLocaleDateString()}</TableCell>{" "}
                <TableCell>{task.updatedBy}</TableCell>
                <TableCell>{new Date(task.updatedAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenModal(task)} startIcon={<EditIcon />} />
                  <Button
                    onClick={() => handleDeleteTask(task.id)}
                    startIcon={<DeleteIcon />}
                    color="secondary"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TaskModal
        visible={isModalVisible}
        task={currentTask}
        onClose={handleCloseModal}
        onCreate={handleCreateTask}
        onUpdate={handleUpdateTask}
        taskName={taskName}
        setTaskName={setTaskName}
        taskType={taskType}
        setTaskType={setTaskType}
        taskDescription={taskDescription}
        setTaskDescription={setTaskDescription}
        taskStatus={taskStatus}
        setTaskStatus={setTaskStatus}
      />
    </div>
  )
}

export default TaskListPage
