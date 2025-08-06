import React from 'react';
import { Download } from 'lucide-react';
import { SchedulingResult, SchedulingAlgorithm } from '../types';

interface ResultsDisplayProps {
  result: SchedulingResult | null;
  algorithm: SchedulingAlgorithm;
  timeQuantum?: number;
}

const algorithmNames = {
  fcfs: 'First Come First Serve',
  sjf: 'Shortest Job First',
  rr: 'Round Robin',
  priority: 'Priority (Non-Preemptive)',
  'priority-preemptive': 'Priority (Preemptive)'
};

export default function ResultsDisplay({ result, algorithm, timeQuantum }: ResultsDisplayProps) {
  if (!result) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Results</h2>
        <div className="text-center py-12 text-gray-500">
          Run a scheduling algorithm to see results
        </div>
      </div>
    );
  }

  const exportResults = () => {
    const data = {
      algorithm: algorithmNames[algorithm],
      ...(algorithm === 'rr' && { timeQuantum }),
      processes: result.processes,
      averageWaitingTime: result.averageWaitingTime,
      averageTurnaroundTime: result.averageTurnaroundTime,
      totalTime: result.totalTime,
      ganttChart: result.ganttChart
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scheduling-results-${algorithm}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Results</h2>
        <button
          onClick={exportResults}
          className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          {algorithmNames[algorithm]}
          {algorithm === 'rr' && ` (Time Quantum: ${timeQuantum})`}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-blue-800">Average Waiting Time</div>
            <div className="text-2xl font-bold text-blue-900">
              {result.averageWaitingTime.toFixed(2)}
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-green-800">Average Turnaround Time</div>
            <div className="text-2xl font-bold text-green-900">
              {result.averageTurnaroundTime.toFixed(2)}
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-purple-800">Total Execution Time</div>
            <div className="text-2xl font-bold text-purple-900">
              {result.totalTime}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Process ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Arrival Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Burst Time
              </th>
              {(algorithm === 'priority' || algorithm === 'priority-preemptive') && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Completion Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Turnaround Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Waiting Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {result.processes.map((process) => (
              <tr key={process.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {process.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {process.arrivalTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {process.burstTime}
                </td>
                {(algorithm === 'priority' || algorithm === 'priority-preemptive') && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {process.priority}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {process.completionTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {process.turnaroundTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {process.waitingTime}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}