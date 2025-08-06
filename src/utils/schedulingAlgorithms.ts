import { Process, GanttBlock, SchedulingResult, SchedulingAlgorithm } from '../types';

const PROCESS_COLORS = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308', 
  '#84CC16', '#22C55E', '#10B981', '#14B8A6',
  '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
  '#8B5CF6', '#A855F7', '#D946EF', '#EC4899'
];

function getProcessColor(processId: string): string {
  const index = parseInt(processId.replace('P', '')) - 1;
  return PROCESS_COLORS[index % PROCESS_COLORS.length];
}

export function fcfsScheduling(processes: Process[]): SchedulingResult {
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const ganttChart: GanttBlock[] = [];
  let currentTime = 0;

  const result = sortedProcesses.map(process => {
    const startTime = Math.max(currentTime, process.arrivalTime);
    const completionTime = startTime + process.burstTime;
    
    ganttChart.push({
      processId: process.id,
      startTime,
      endTime: completionTime,
      color: getProcessColor(process.id)
    });

    currentTime = completionTime;

    return {
      ...process,
      completionTime,
      turnaroundTime: completionTime - process.arrivalTime,
      waitingTime: startTime - process.arrivalTime
    };
  });

  const averageWaitingTime = result.reduce((sum, p) => sum + p.waitingTime!, 0) / result.length;
  const averageTurnaroundTime = result.reduce((sum, p) => sum + p.turnaroundTime!, 0) / result.length;

  return {
    processes: result,
    ganttChart,
    averageWaitingTime,
    averageTurnaroundTime,
    totalTime: currentTime
  };
}

export function sjfScheduling(processes: Process[]): SchedulingResult {
  const ganttChart: GanttBlock[] = [];
  const completed: Process[] = [];
  const remaining = [...processes];
  let currentTime = 0;

  while (remaining.length > 0) {
    const available = remaining.filter(p => p.arrivalTime <= currentTime);
    
    if (available.length === 0) {
      currentTime = Math.min(...remaining.map(p => p.arrivalTime));
      continue;
    }

    const shortest = available.reduce((min, current) => 
      current.burstTime < min.burstTime ? current : min
    );

    const completionTime = currentTime + shortest.burstTime;
    
    ganttChart.push({
      processId: shortest.id,
      startTime: currentTime,
      endTime: completionTime,
      color: getProcessColor(shortest.id)
    });

    const processResult: Process = {
      ...shortest,
      completionTime,
      turnaroundTime: completionTime - shortest.arrivalTime,
      waitingTime: currentTime - shortest.arrivalTime
    };

    completed.push(processResult);
    remaining.splice(remaining.indexOf(shortest), 1);
    currentTime = completionTime;
  }

  const averageWaitingTime = completed.reduce((sum, p) => sum + p.waitingTime!, 0) / completed.length;
  const averageTurnaroundTime = completed.reduce((sum, p) => sum + p.turnaroundTime!, 0) / completed.length;

  return {
    processes: completed,
    ganttChart,
    averageWaitingTime,
    averageTurnaroundTime,
    totalTime: currentTime
  };
}

export function roundRobinScheduling(processes: Process[], timeQuantum: number): SchedulingResult {
  const ganttChart: GanttBlock[] = [];
  const queue: Process[] = [];
  const remaining = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
  const completed: Process[] = [];
  let currentTime = 0;

  // Add initial processes
  remaining
    .filter(p => p.arrivalTime <= currentTime)
    .forEach(p => {
      queue.push(p);
      remaining.splice(remaining.indexOf(p), 1);
    });

  while (queue.length > 0 || remaining.length > 0) {
    if (queue.length === 0) {
      currentTime = Math.min(...remaining.map(p => p.arrivalTime));
      remaining
        .filter(p => p.arrivalTime <= currentTime)
        .forEach(p => {
          queue.push(p);
          remaining.splice(remaining.indexOf(p), 1);
        });
      continue;
    }

    const current = queue.shift()!;
    const executionTime = Math.min(current.remainingTime!, timeQuantum);
    const startTime = currentTime;
    currentTime += executionTime;

    ganttChart.push({
      processId: current.id,
      startTime,
      endTime: currentTime,
      color: getProcessColor(current.id)
    });

    current.remainingTime! -= executionTime;

    // Add newly arrived processes
    remaining
      .filter(p => p.arrivalTime <= currentTime)
      .forEach(p => {
        queue.push(p);
        remaining.splice(remaining.indexOf(p), 1);
      });

    if (current.remainingTime! > 0) {
      queue.push(current);
    } else {
      const processResult: Process = {
        ...current,
        completionTime: currentTime,
        turnaroundTime: currentTime - current.arrivalTime,
        waitingTime: currentTime - current.arrivalTime - current.burstTime
      };
      completed.push(processResult);
    }
  }

  const averageWaitingTime = completed.reduce((sum, p) => sum + p.waitingTime!, 0) / completed.length;
  const averageTurnaroundTime = completed.reduce((sum, p) => sum + p.turnaroundTime!, 0) / completed.length;

  return {
    processes: completed,
    ganttChart,
    averageWaitingTime,
    averageTurnaroundTime,
    totalTime: currentTime
  };
}

export function priorityScheduling(processes: Process[], preemptive: boolean = false): SchedulingResult {
  if (!preemptive) {
    return priorityNonPreemptive(processes);
  }
  return priorityPreemptive(processes);
}

function priorityNonPreemptive(processes: Process[]): SchedulingResult {
  const ganttChart: GanttBlock[] = [];
  const completed: Process[] = [];
  const remaining = [...processes];
  let currentTime = 0;

  while (remaining.length > 0) {
    const available = remaining.filter(p => p.arrivalTime <= currentTime);
    
    if (available.length === 0) {
      currentTime = Math.min(...remaining.map(p => p.arrivalTime));
      continue;
    }

    const highest = available.reduce((max, current) => 
      (current.priority || 0) > (max.priority || 0) ? current : max
    );

    const completionTime = currentTime + highest.burstTime;
    
    ganttChart.push({
      processId: highest.id,
      startTime: currentTime,
      endTime: completionTime,
      color: getProcessColor(highest.id)
    });

    const processResult: Process = {
      ...highest,
      completionTime,
      turnaroundTime: completionTime - highest.arrivalTime,
      waitingTime: currentTime - highest.arrivalTime
    };

    completed.push(processResult);
    remaining.splice(remaining.indexOf(highest), 1);
    currentTime = completionTime;
  }

  const averageWaitingTime = completed.reduce((sum, p) => sum + p.waitingTime!, 0) / completed.length;
  const averageTurnaroundTime = completed.reduce((sum, p) => sum + p.turnaroundTime!, 0) / completed.length;

  return {
    processes: completed,
    ganttChart,
    averageWaitingTime,
    averageTurnaroundTime,
    totalTime: currentTime
  };
}

function priorityPreemptive(processes: Process[]): SchedulingResult {
  const ganttChart: GanttBlock[] = [];
  const completed: Process[] = [];
  const remaining = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
  let currentTime = 0;

  while (remaining.length > 0) {
    const available = remaining.filter(p => p.arrivalTime <= currentTime);
    
    if (available.length === 0) {
      currentTime = Math.min(...remaining.map(p => p.arrivalTime));
      continue;
    }

    const highest = available.reduce((max, current) => 
      (current.priority || 0) > (max.priority || 0) ? current : max
    );

    const nextArrival = remaining
      .filter(p => p.arrivalTime > currentTime)
      .reduce((min, p) => Math.min(min, p.arrivalTime), Infinity);

    const executionTime = Math.min(
      highest.remainingTime!,
      nextArrival === Infinity ? highest.remainingTime! : nextArrival - currentTime
    );

    const startTime = currentTime;
    currentTime += executionTime;

    ganttChart.push({
      processId: highest.id,
      startTime,
      endTime: currentTime,
      color: getProcessColor(highest.id)
    });

    highest.remainingTime! -= executionTime;

    if (highest.remainingTime! === 0) {
      const processResult: Process = {
        ...highest,
        completionTime: currentTime,
        turnaroundTime: currentTime - highest.arrivalTime,
        waitingTime: currentTime - highest.arrivalTime - highest.burstTime
      };
      completed.push(processResult);
      remaining.splice(remaining.indexOf(highest), 1);
    }
  }

  const averageWaitingTime = completed.reduce((sum, p) => sum + p.waitingTime!, 0) / completed.length;
  const averageTurnaroundTime = completed.reduce((sum, p) => sum + p.turnaroundTime!, 0) / completed.length;

  return {
    processes: completed,
    ganttChart,
    averageWaitingTime,
    averageTurnaroundTime,
    totalTime: currentTime
  };
}

export function runSchedulingAlgorithm(
  algorithm: SchedulingAlgorithm,
  processes: Process[],
  timeQuantum?: number
): SchedulingResult {
  switch (algorithm) {
    case 'fcfs':
      return fcfsScheduling(processes);
    case 'sjf':
      return sjfScheduling(processes);
    case 'rr':
      return roundRobinScheduling(processes, timeQuantum || 2);
    case 'priority':
      return priorityScheduling(processes, false);
    case 'priority-preemptive':
      return priorityScheduling(processes, true);
    default:
      throw new Error(`Unknown algorithm: ${algorithm}`);
  }
}