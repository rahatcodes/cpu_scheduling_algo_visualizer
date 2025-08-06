export interface Process {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority?: number;
  remainingTime?: number;
  completionTime?: number;
  turnaroundTime?: number;
  waitingTime?: number;
}

export interface GanttBlock {
  processId: string;
  startTime: number;
  endTime: number;
  color?: string;
}

export interface SchedulingResult {
  processes: Process[];
  ganttChart: GanttBlock[];
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  totalTime: number;
}

export type SchedulingAlgorithm = 'fcfs' | 'sjf' | 'rr' | 'priority' | 'priority-preemptive';

export interface AlgorithmConfig {
  algorithm: SchedulingAlgorithm;
  timeQuantum?: number;
}