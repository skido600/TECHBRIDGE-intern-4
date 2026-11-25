import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getTasks, saveTasks } from "./store";
import type { Task, TaskStatus } from "./types";

const app = express();
const PORT = Number(process.env.PORT ?? 3000);
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const frontendDir = path.resolve(currentDir, "../../frontend");

const validStatuses: TaskStatus[] = ["not-started", "in-progress", "completed"];

app.use(express.json({ limit: "100kb" }));
app.use(express.static(frontendDir));

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "TechBridge Task Management API is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/tasks", async (_req, res, next) => {
  try {
    const tasks = await getTasks();
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    next(error);
  }
});

app.get("/api/tasks/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({
        success: false,
        message: "Task ID must be a positive integer.",
      });
      return;
    }
    const tasks = await getTasks();
    const task = tasks.find((item) => item.id === id);
    if (!task) {
      res
        .status(404)
        .json({ success: false, message: `Task ${id} was not found.` });
      return;
    }
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
});

app.put("/api/tasks/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body as { status?: TaskStatus };
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({
        success: false,
        message: "Task ID must be a positive integer.",
      });
      return;
    }
    if (!validStatuses.includes(status as TaskStatus)) {
      res.status(400).json({
        success: false,
        message: "Status must be not-started, in-progress, or completed.",
      });
      return;
    }
    const tasks = await getTasks();
    const index = tasks.findIndex((item) => item.id === id);
    if (index === -1) {
      res
        .status(404)
        .json({ success: false, message: `Task ${id} was not found.` });
      return;
    }
    tasks[index] = { ...tasks[index], status: status as TaskStatus };
    await saveTasks(tasks);
    res.json({
      success: true,
      message: "Task status updated successfully.",
      data: tasks[index],
    });
  } catch (error) {
    next(error);
  }
});

// Optional challenge: create a task.
app.post("/api/tasks", async (req, res, next) => {
  try {
    const {
      title,
      description,
      details = "",
      difficulty = "Intermediate",
      timing = "Custom",
      technologies = [],
    } = req.body as Partial<Task>;
    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof description !== "string" ||
      !description.trim()
    ) {
      res.status(400).json({
        success: false,
        message: "Title and description are required.",
      });
      return;
    }
    const tasks = await getTasks();
    const task: Task = {
      id: tasks.length ? Math.max(...tasks.map((item) => item.id)) + 1 : 1,
      title: title.trim(),
      description: description.trim(),
      details: typeof details === "string" ? details : "",
      status: "not-started",
      difficulty: typeof difficulty === "string" ? difficulty : "Intermediate",
      timing: typeof timing === "string" ? timing : "Custom",
      technologies: Array.isArray(technologies)
        ? technologies.filter(
            (item): item is string => typeof item === "string",
          )
        : [],
    };
    tasks.push(task);
    await saveTasks(tasks);
    res.status(201).json({
      success: true,
      message: "Task created successfully.",
      data: task,
    });
  } catch (error) {
    next(error);
  }
});

// Optional challenge: delete a task.
app.delete("/api/tasks/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const tasks = await getTasks();
    const updatedTasks = tasks.filter((task) => task.id !== id);
    if (updatedTasks.length === tasks.length) {
      res
        .status(404)
        .json({ success: false, message: `Task ${id} was not found.` });
      return;
    }
    await saveTasks(updatedTasks);
    res.json({ success: true, message: "Task deleted successfully." });
  } catch (error) {
    next(error);
  }
});

app.get("/", (_req, res) =>
  res.sendFile(path.join(frontendDir, "dashboard.html")),
);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} was not found.`,
  });
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res
    .status(500)
    .json({ success: false, message: "An unexpected server error occurred." });
});

app.listen(PORT, () => {
  console.log(`TechBridge API running at http://localhost:${PORT}`);
  console.log(`Dashboard: http://localhost:${PORT}/dashboard.html`);
  console.log(`API tasks: http://localhost:${PORT}/api/tasks`);
});
