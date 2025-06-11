"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Trash2,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Circle,
  Calendar,
  Edit3,
  Save,
  X,
  Download,
  Upload,
  Clock,
  Target,
  Tag,
  AlertCircle,
  Zap,
  TrendingUp,
  BarChart3,
  Settings,
  Archive,
  FileText,
  Timer,
  FileSpreadsheet,
  ChevronDown,
} from "lucide-react"

interface Task {
  id: string
  text: string
  description?: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
  dueDate?: Date
  priority: "low" | "medium" | "high"
  category: string
  tags: string[]
  timeSpent: number // in minutes
  estimatedTime?: number // in minutes
}

interface Category {
  id: string
  name: string
  icon: string
  color: string
}

type SortOption = "newest" | "oldest" | "priority" | "alphabetical" | "dueDate" | "category"
type FilterOption = "all" | "active" | "completed" | "overdue" | "today" | "week"

const defaultCategories: Category[] = [
  { id: "work", name: "Work", icon: "💼", color: "bg-blue-500" },
  { id: "personal", name: "Personal", icon: "🏠", color: "bg-green-500" },
  { id: "health", name: "Health", icon: "❤️", color: "bg-red-500" },
  { id: "learning", name: "Learning", icon: "📚", color: "bg-purple-500" },
  { id: "shopping", name: "Shopping", icon: "🛒", color: "bg-yellow-500" },
  { id: "other", name: "Other", icon: "📝", color: "bg-gray-500" },
]

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [categories, setCategories] = useState<Category[]>(defaultCategories)
  const [newTask, setNewTask] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [newTaskDueDate, setNewTaskDueDate] = useState("")
  const [newTaskCategory, setNewTaskCategory] = useState("other")
  const [newTaskTags, setNewTaskTags] = useState("")
  const [newTaskEstimatedTime, setNewTaskEstimatedTime] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [filterBy, setFilterBy] = useState<FilterOption>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [error, setError] = useState("")
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [showCompleted, setShowCompleted] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("taskflow-tasks")
    const savedCategories = localStorage.getItem("taskflow-categories")

    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        }))
        setTasks(parsedTasks)
      } catch (error) {
        console.error("Error loading tasks from localStorage:", error)
      }
    }

    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories))
      } catch (error) {
        console.error("Error loading categories from localStorage:", error)
      }
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("taskflow-tasks", JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem("taskflow-categories", JSON.stringify(categories))
  }, [categories])

  // Input validation
  const validateTask = (text: string): boolean => {
    if (!text.trim()) {
      setError("Task cannot be empty")
      return false
    }
    if (text.trim().length < 3) {
      setError("Task must be at least 3 characters long")
      return false
    }
    if (text.trim().length > 100) {
      setError("Task must be less than 100 characters")
      return false
    }
    if (tasks.some((task) => task.text.toLowerCase() === text.trim().toLowerCase() && !task.completed)) {
      setError("Active task with this name already exists")
      return false
    }
    setError("")
    return true
  }

  const addTask = () => {
    const trimmedTask = newTask.trim()
    if (validateTask(trimmedTask)) {
      const task: Task = {
        id: Date.now().toString(),
        text: trimmedTask,
        description: newTaskDescription.trim() || undefined,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        dueDate: newTaskDueDate ? new Date(newTaskDueDate) : undefined,
        priority,
        category: newTaskCategory,
        tags: newTaskTags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        timeSpent: 0,
        estimatedTime: newTaskEstimatedTime ? Number.parseInt(newTaskEstimatedTime) : undefined,
      }
      setTasks((prev) => [task, ...prev])
      resetForm()
      setIsAddDialogOpen(false)
    }
  }

  const resetForm = () => {
    setNewTask("")
    setNewTaskDescription("")
    setNewTaskDueDate("")
    setNewTaskCategory("other")
    setNewTaskTags("")
    setNewTaskEstimatedTime("")
    setPriority("medium")
    setError("")
  }

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed, updatedAt: new Date() } : task)),
    )
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const startEditing = (task: Task) => {
    setEditingTask(task.id)
    setEditText(task.text)
    setEditDescription(task.description || "")
  }

  const saveEdit = (id: string) => {
    if (editText.trim()) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                ...task,
                text: editText.trim(),
                description: editDescription.trim() || undefined,
                updatedAt: new Date(),
              }
            : task,
        ),
      )
      setEditingTask(null)
      setEditText("")
      setEditDescription("")
    }
  }

  const cancelEdit = () => {
    setEditingTask(null)
    setEditText("")
    setEditDescription("")
  }

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((task) => !task.completed))
  }

  const exportToJSON = () => {
    const dataStr = JSON.stringify({ tasks, categories }, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `taskflow-backup-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportToPDF = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>TaskFlow Pro - Tasks Export</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .stats { display: flex; justify-content: space-around; margin-bottom: 30px; }
            .stat-card { text-align: center; padding: 10px; border: 1px solid #ccc; border-radius: 5px; }
            .task { margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
            .task.completed { opacity: 0.6; text-decoration: line-through; }
            .task-title { font-weight: bold; margin-bottom: 5px; }
            .task-meta { font-size: 12px; color: #666; }
            .priority-high { border-left: 4px solid #ef4444; }
            .priority-medium { border-left: 4px solid #eab308; }
            .priority-low { border-left: 4px solid #22c55e; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎯 TaskFlow Pro - Tasks Export</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="stats">
            <div class="stat-card">
              <h3>${stats.total}</h3>
              <p>Total Tasks</p>
            </div>
            <div class="stat-card">
              <h3>${stats.completed}</h3>
              <p>Completed</p>
            </div>
            <div class="stat-card">
              <h3>${stats.active}</h3>
              <p>Active</p>
            </div>
            <div class="stat-card">
              <h3>${stats.completionRate}%</h3>
              <p>Completion Rate</p>
            </div>
          </div>
          <div class="tasks">
            ${filteredAndSortedTasks
              .map(
                (task) => `
              <div class="task priority-${task.priority} ${task.completed ? "completed" : ""}">
                <div class="task-title">${getCategoryIcon(task.category)} ${task.text}</div>
                ${task.description ? `<div class="task-description">${task.description}</div>` : ""}
                <div class="task-meta">
                  Priority: ${task.priority.toUpperCase()} | 
                  Category: ${categories.find((c) => c.id === task.category)?.name || "Other"} |
                  Created: ${task.createdAt.toLocaleDateString()}
                  ${task.dueDate ? ` | Due: ${task.dueDate.toLocaleDateString()}` : ""}
                  ${task.tags.length > 0 ? ` | Tags: ${task.tags.join(", ")}` : ""}
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.print()
  }

  const exportToExcel = () => {
    const csvContent = [
      [
        "Task",
        "Description",
        "Status",
        "Priority",
        "Category",
        "Created Date",
        "Due Date",
        "Tags",
        "Estimated Time",
      ].join(","),
      ...filteredAndSortedTasks.map((task) =>
        [
          `"${task.text}"`,
          `"${task.description || ""}"`,
          task.completed ? "Completed" : "Active",
          task.priority,
          categories.find((c) => c.id === task.category)?.name || "Other",
          task.createdAt.toLocaleDateString(),
          task.dueDate ? task.dueDate.toLocaleDateString() : "",
          `"${task.tags.join(", ")}"`,
          task.estimatedTime || "",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `taskflow-tasks-${new Date().toISOString().split("T")[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = []
    let current = ""
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === "," && !inQuotes) {
        result.push(current.trim())
        current = ""
      } else {
        current += char
      }
    }

    result.push(current.trim())
    return result
  }

  const importFromCSV = (csvContent: string) => {
    try {
      const lines = csvContent.split("\n").filter((line) => line.trim())
      if (lines.length < 2) {
        setError("CSV file must have at least a header and one data row")
        return
      }

      const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().replace(/"/g, ""))
      const importedTasks: Task[] = []

      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i])
        if (values.length < headers.length) continue

        const taskData: any = {}
        headers.forEach((header, index) => {
          taskData[header] = values[index]?.replace(/"/g, "") || ""
        })

        // Map CSV columns to task properties
        const taskText = taskData.task || taskData.title || taskData.name || taskData.text
        if (!taskText || taskText.trim().length < 3) continue

        // Map priority
        let priority: "low" | "medium" | "high" = "medium"
        const priorityValue = taskData.priority?.toLowerCase()
        if (priorityValue === "high" || priorityValue === "urgent") priority = "high"
        else if (priorityValue === "low") priority = "low"

        // Map category
        let category = "other"
        const categoryValue = taskData.category?.toLowerCase()
        const foundCategory = categories.find((c) => c.name.toLowerCase() === categoryValue || c.id === categoryValue)
        if (foundCategory) category = foundCategory.id

        // Map status
        const statusValue = taskData.status?.toLowerCase()
        const completed = statusValue === "completed" || statusValue === "done" || statusValue === "finished"

        // Parse dates
        let dueDate: Date | undefined
        if (taskData["due date"] || taskData.duedate || taskData.due) {
          const dueDateStr = taskData["due date"] || taskData.duedate || taskData.due
          const parsedDate = new Date(dueDateStr)
          if (!isNaN(parsedDate.getTime())) {
            dueDate = parsedDate
          }
        }

        // Parse tags
        const tagsStr = taskData.tags || taskData.tag || ""
        const tags = tagsStr
          ? tagsStr
              .split(",")
              .map((tag: string) => tag.trim())
              .filter((tag: string) => tag)
          : []

        // Parse estimated time
        let estimatedTime: number | undefined
        const estimatedTimeStr = taskData["estimated time"] || taskData.estimatedtime || taskData.estimate
        if (estimatedTimeStr) {
          const parsed = Number.parseInt(estimatedTimeStr)
          if (!isNaN(parsed)) estimatedTime = parsed
        }

        const newTask: Task = {
          id: `imported-${Date.now()}-${i}`,
          text: taskText.trim(),
          description: taskData.description || undefined,
          completed,
          createdAt: new Date(),
          updatedAt: new Date(),
          dueDate,
          priority,
          category,
          tags,
          timeSpent: 0,
          estimatedTime,
        }

        importedTasks.push(newTask)
      }

      if (importedTasks.length > 0) {
        setTasks((prev) => [...importedTasks, ...prev])
        setError("")
        alert(`Successfully imported ${importedTasks.length} tasks!`)
      } else {
        setError("No valid tasks found in the CSV file")
      }
    } catch (error) {
      console.error("Error parsing CSV:", error)
      setError("Error parsing CSV file. Please check the format.")
    }
  }

  const importTasks = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string

          if (file.name.endsWith(".json")) {
            // Handle JSON import
            const data = JSON.parse(content)
            if (data.tasks) {
              const importedTasks = data.tasks.map((task: any) => ({
                ...task,
                createdAt: new Date(task.createdAt),
                updatedAt: new Date(task.updatedAt),
                dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
              }))
              setTasks(importedTasks)
            }
            if (data.categories) {
              setCategories(data.categories)
            }
            setError("")
          } else if (file.name.endsWith(".csv")) {
            // Handle CSV import
            importFromCSV(content)
          } else {
            setError("Please select a JSON or CSV file")
          }
        } catch (error) {
          console.error("Error importing file:", error)
          setError("Invalid file format or corrupted file")
        }
      }
      reader.readAsText(file)
    }
    // Reset the input value so the same file can be selected again
    event.target.value = ""
  }

  // Enhanced search functionality
  const filteredAndSortedTasks = useMemo(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

    const filtered = tasks.filter((task) => {
      // Enhanced search functionality
      const searchLower = searchTerm.toLowerCase().trim()
      const matchesSearch =
        !searchLower ||
        task.text.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower)) ||
        task.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
        task.priority.toLowerCase().includes(searchLower) ||
        categories
          .find((c) => c.id === task.category)
          ?.name.toLowerCase()
          .includes(searchLower)

      const matchesCategory = selectedCategory === "all" || task.category === selectedCategory

      const matchesFilter = (() => {
        switch (filterBy) {
          case "all":
            return showCompleted || !task.completed
          case "active":
            return !task.completed
          case "completed":
            return task.completed
          case "overdue":
            return task.dueDate && task.dueDate < now && !task.completed
          case "today":
            return (
              task.dueDate && task.dueDate >= today && task.dueDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)
            )
          case "week":
            return task.dueDate && task.dueDate >= today && task.dueDate <= weekFromNow
          default:
            return true
        }
      })()

      return matchesSearch && matchesCategory && matchesFilter
    })

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.createdAt.getTime() - a.createdAt.getTime()
        case "oldest":
          return a.createdAt.getTime() - b.createdAt.getTime()
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case "alphabetical":
          return a.text.localeCompare(b.text)
        case "dueDate":
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return a.dueDate.getTime() - b.dueDate.getTime()
        case "category":
          return a.category.localeCompare(b.category)
        default:
          return 0
      }
    })
  }, [tasks, searchTerm, sortBy, filterBy, selectedCategory, showCompleted, categories])

  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((task) => task.completed).length
    const active = total - completed
    const overdue = tasks.filter((task) => task.dueDate && task.dueDate < new Date() && !task.completed).length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    return { total, completed, active, overdue, completionRate }
  }, [tasks])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500 text-white"
      case "medium":
        return "bg-yellow-500 text-black"
      case "low":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="w-3 h-3" />
      case "medium":
        return <Clock className="w-3 h-3" />
      case "low":
        return <Circle className="w-3 h-3" />
      default:
        return <Circle className="w-3 h-3" />
    }
  }

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category?.icon || "📝"
  }

  const isOverdue = (task: Task) => {
    return task.dueDate && task.dueDate < new Date() && !task.completed
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      addTask()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black p-4 md:p-8 transition-all duration-500">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg border-2 border-blue-400/30">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-300 to-cyan-200 bg-clip-text text-transparent">
              TaskFlow Pro
            </h1>
          </div>
          <p className="text-blue-200 text-lg flex items-center justify-center gap-2">
            <Zap className="w-5 h-5" />
            Organize your life, boost your productivity
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-2 border-slate-600/50 shadow-xl hover:border-blue-500/50 transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-sm text-blue-300">Total</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 backdrop-blur-sm border-2 border-slate-600/50 shadow-xl hover:border-green-500/50 transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stats.completed}</div>
              <div className="text-sm text-green-300">Done</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 backdrop-blur-sm border-2 border-slate-600/50 shadow-xl hover:border-yellow-500/50 transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stats.active}</div>
              <div className="text-sm text-yellow-300">Active</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 backdrop-blur-sm border-2 border-slate-600/50 shadow-xl hover:border-red-500/50 transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stats.overdue}</div>
              <div className="text-sm text-red-300">Overdue</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 backdrop-blur-sm border-2 border-slate-600/50 shadow-xl hover:border-purple-500/50 transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stats.completionRate}%</div>
              <div className="text-sm text-purple-300">Complete</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Add Task */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-2 border-slate-600/50 shadow-xl mb-8">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Quick add task... (Press Enter to add)"
                  value={newTask}
                  onChange={(e) => {
                    setNewTask(e.target.value)
                    if (error) setError("")
                  }}
                  onKeyPress={handleKeyPress}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                />
                {error && <p className="text-red-400 text-sm mt-2 animate-pulse">{error}</p>}
              </div>
              <div className="flex gap-2">
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-slate-600 text-white hover:text-white hover:bg-slate-700/50 bg-slate-700/30"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Advanced
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-800 text-white border-slate-700">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-white">
                        <Plus className="w-5 h-5" />
                        Add New Task
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="task-title" className="text-white">
                          Task Title *
                        </Label>
                        <Input
                          id="task-title"
                          value={newTask}
                          onChange={(e) => setNewTask(e.target.value)}
                          placeholder="What needs to be done?"
                          className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="task-description" className="text-white">
                          Description
                        </Label>
                        <Textarea
                          id="task-description"
                          value={newTaskDescription}
                          onChange={(e) => setNewTaskDescription(e.target.value)}
                          placeholder="Add more details..."
                          className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="task-category" className="text-white">
                            Category
                          </Label>
                          <Select value={newTaskCategory} onValueChange={setNewTaskCategory}>
                            <SelectTrigger className="mt-1 bg-slate-700/50 border-slate-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                  className="text-white hover:text-white hover:bg-slate-700 focus:text-white focus:bg-slate-700"
                                >
                                  <span className="flex items-center gap-2">
                                    <span>{category.icon}</span>
                                    {category.name}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="task-priority" className="text-white">
                            Priority
                          </Label>
                          <Select
                            value={priority}
                            onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}
                          >
                            <SelectTrigger className="mt-1 bg-slate-700/50 border-slate-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                              <SelectItem
                                value="low"
                                className="text-white hover:text-white hover:bg-slate-700 focus:text-white focus:bg-slate-700"
                              >
                                🟢 Low
                              </SelectItem>
                              <SelectItem
                                value="medium"
                                className="text-white hover:text-white hover:bg-slate-700 focus:text-white focus:bg-slate-700"
                              >
                                🟡 Medium
                              </SelectItem>
                              <SelectItem
                                value="high"
                                className="text-white hover:text-white hover:bg-slate-700 focus:text-white focus:bg-slate-700"
                              >
                                🔴 High
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="task-due-date" className="text-white">
                            Due Date
                          </Label>
                          <Input
                            id="task-due-date"
                            type="datetime-local"
                            value={newTaskDueDate}
                            onChange={(e) => setNewTaskDueDate(e.target.value)}
                            className="mt-1 bg-slate-700/50 border-slate-600 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="task-estimated-time" className="text-white">
                            Estimated Time (minutes)
                          </Label>
                          <Input
                            id="task-estimated-time"
                            type="number"
                            value={newTaskEstimatedTime}
                            onChange={(e) => setNewTaskEstimatedTime(e.target.value)}
                            placeholder="60"
                            className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="task-tags" className="text-white">
                          Tags (comma separated)
                        </Label>
                        <Input
                          id="task-tags"
                          value={newTaskTags}
                          onChange={(e) => setNewTaskTags(e.target.value)}
                          placeholder="urgent, meeting, review"
                          className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                        />
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={addTask}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Task
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsAddDialogOpen(false)}
                          className="border-slate-600 text-white hover:text-white hover:bg-slate-700/50 bg-slate-700/30"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  onClick={addTask}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-6 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-2 border-slate-600/50 shadow-xl mb-8">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search tasks, descriptions, tags, priority, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40 bg-slate-700/50 border-slate-600 text-white">
                    <Tag className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem
                      value="all"
                      className="text-white hover:text-white hover:bg-slate-700 focus:text-white focus:bg-slate-700"
                    >
                      All Categories
                    </SelectItem>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id}
                        className="text-white hover:text-white hover:bg-slate-700 focus:text-white focus:bg-slate-700"
                      >
                        <span className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          {category.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterBy} onValueChange={(value: FilterOption) => setFilterBy(value)}>
                  <SelectTrigger className="w-32 bg-slate-700/50 border-slate-600 text-white">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem
                      value="all"
                      className="text-white hover:text-white hover:bg-slate-700 focus:text-white focus:bg-slate-700"
                    >
                      All
                    </SelectItem>
                    <SelectItem
                      value="active"
                      className="text-white hover:text-white hover:bg-slate-700 focus:text-white focus:bg-slate-700"
                    >
                      Active
                    </SelectItem>
                    <SelectItem
                      value="completed"
                      className="text-white hover:text-white hover:bg-slate-700 focus:text-white focus:bg-slate-700"
                    >
                      Completed
                    </SelectItem>
                    <SelectItem
                      value="overdue"
                      className="text-white hover:text-white hover:bg-slate-700 focus:text-white focus:bg-slate-700"
                    >
                      Overdue
                    </SelectItem>
                    <SelectItem
                      value="today"
                      className="text-white hover:text-white hover:bg-slate-700 focus:text-white focus:bg-slate-700"
                    >
                      Due Today
                    </SelectItem>
                    <SelectItem
                      value="week"
                      className="text-white hover:text-white hover:bg-slate-700 focus:text-white focus:bg-slate-700"
                    >
                      This Week
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                  <SelectTrigger className="w-40 bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem
                      value="newest"
                      className="text-white hover:text-white hover:bg-slate-700 focus:text-white focus:bg-slate-700"
                    >
                      Newest First
                    </SelectItem>
                    <SelectItem
                      value="oldest"
                      className="text-white hover:text-white hover:bg-slate-700 focus:text-white focus:bg-slate-700"
                    >
                      Oldest First
                    </SelectItem>
                    <SelectItem
                      value="priority"
                      className="text-white hover:text-white hover:bg-slate-700 focus:text-white focus:bg-slate-700"
                    >
                      By Priority
                    </SelectItem>
                    <SelectItem
                      value="dueDate"
                      className="text-white hover:text-white hover:bg-slate-700 focus:text-white focus:bg-slate-700"
                    >
                      By Due Date
                    </SelectItem>
                    <SelectItem
                      value="category"
                      className="text-white hover:text-white hover:bg-slate-700 focus:text-white focus:bg-slate-700"
                    >
                      By Category
                    </SelectItem>
                    <SelectItem
                      value="alphabetical"
                      className="text-white hover:text-white hover:bg-slate-700 focus:text-white focus:bg-slate-700"
                    >
                      A-Z
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 mt-4 flex-wrap">
              <Button
                onClick={() => setShowCompleted(!showCompleted)}
                variant="outline"
                size="sm"
                className="border-slate-600 text-white hover:text-white hover:bg-slate-700/50 bg-slate-700/30"
              >
                {showCompleted ? <Archive className="w-4 h-4 mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                {showCompleted ? "Hide" : "Show"} Completed
              </Button>
              {stats.completed > 0 && (
                <Button
                  onClick={clearCompleted}
                  variant="outline"
                  size="sm"
                  className="border-red-500 text-red-400 hover:text-red-300 hover:bg-red-500/20 bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Completed
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-white hover:text-white hover:bg-slate-700/50 bg-slate-700/30"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-800 border-slate-700">
                  <DropdownMenuItem
                    onClick={exportToPDF}
                    className="text-white hover:text-white hover:bg-slate-700 focus:text-white focus:bg-slate-700 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={exportToExcel}
                    className="text-white hover:text-white hover:bg-slate-700 focus:text-white focus:bg-slate-700 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Export as Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={exportToJSON}
                    className="text-white hover:text-white hover:bg-slate-700 focus:text-white focus:bg-slate-700 cursor-pointer"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export as JSON
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <label className="cursor-pointer">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-white hover:text-white hover:bg-slate-700/50 bg-slate-700/30"
                  asChild
                >
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </span>
                </Button>
                <input type="file" accept=".json,.csv" onChange={importTasks} className="hidden" />
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredAndSortedTasks.length === 0 ? (
            <Card className="bg-slate-800/50 backdrop-blur-sm border-2 border-slate-600/50 shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-2 border-blue-500/30">
                    <FileText className="w-12 h-12 text-slate-400" />
                  </div>
                  <div className="text-slate-300 text-lg">
                    {tasks.length === 0
                      ? "No tasks yet. Create your first task above!"
                      : "No tasks match your current filters."}
                  </div>
                  {tasks.length === 0 && (
                    <Button
                      onClick={() => setIsAddDialogOpen(true)}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Task
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredAndSortedTasks.map((task, index) => (
              <Card
                key={task.id}
                className={`bg-slate-800/50 backdrop-blur-sm border-2 border-slate-600/50 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-slate-800/70 hover:border-blue-500/50 ${
                  task.completed ? "opacity-75" : ""
                } ${isOverdue(task) ? "ring-2 ring-red-400/50 border-red-400/50" : ""}`}
                style={{
                  animationName: "fadeInUp",
                  animationDuration: "0.5s",
                  animationTimingFunction: "ease-out",
                  animationFillMode: "forwards",
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <CardContent className="p-4">
                  {editingTask === task.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                      <Textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Add description..."
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => saveEdit(task.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          onClick={cancelEdit}
                          variant="outline"
                          size="sm"
                          className="border-slate-600 text-white hover:text-white hover:bg-slate-700/50"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.id)}
                        className="mt-1 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 border-slate-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div
                              className={`text-white font-medium ${task.completed ? "line-through opacity-60" : ""} flex items-center gap-2`}
                            >
                              <span className="text-lg">{getCategoryIcon(task.category)}</span>
                              {task.text}
                              {isOverdue(task) && (
                                <Badge className="bg-red-500 text-white text-xs">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Overdue
                                </Badge>
                              )}
                            </div>
                            {task.description && (
                              <p
                                className={`text-slate-300 text-sm mt-1 ${task.completed ? "line-through opacity-60" : ""}`}
                              >
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <Badge className={`${getPriorityColor(task.priority)} text-xs flex items-center gap-1`}>
                                {getPriorityIcon(task.priority)}
                                {task.priority}
                              </Badge>
                              {task.dueDate && (
                                <Badge
                                  variant="outline"
                                  className={`text-xs flex items-center gap-1 ${isOverdue(task) ? "border-red-400 text-red-400 bg-red-500/10" : "border-slate-500 text-slate-300 bg-slate-700/30"}`}
                                >
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(task.dueDate)}
                                </Badge>
                              )}
                              {task.estimatedTime && (
                                <Badge
                                  variant="outline"
                                  className="text-xs flex items-center gap-1 border-slate-500 text-slate-300 bg-slate-700/30"
                                >
                                  <Timer className="w-3 h-3" />
                                  {task.estimatedTime}m
                                </Badge>
                              )}
                              {task.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs border-slate-500 text-slate-300 bg-slate-700/30"
                                >
                                  <Tag className="w-3 h-3 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {task.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-green-400" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-400" />
                            )}
                            <Button
                              onClick={() => startEditing(task)}
                              variant="ghost"
                              size="sm"
                              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => deleteTask(task.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 text-sm">© {new Date().getFullYear()} TaskFlow Pro. All rights reserved.</p>
          <p className="text-slate-500 text-xs mt-1">Made by Lakshay Dhoundiyal</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
