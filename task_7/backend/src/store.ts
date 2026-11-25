import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Task } from "./types";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.resolve(currentDir, "../data/tasks.json");

export async function getTasks(): Promise<Task[]> {
  const contents = await readFile(dataFile, "utf8");
  return JSON.parse(contents) as Task[];
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  await writeFile(dataFile, `${JSON.stringify(tasks, null, 2)}\n`, "utf8");
}
