export type TaskStatus = "not-started" | "in-progress" | "completed";

export interface Task {
  id: number;
  title: string;
  description: string;
  details: string;
  status: TaskStatus;
  difficulty: string;
  timing: string;
  technologies: string[];
}
