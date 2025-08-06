import React from 'react';
import { SchedulingAlgorithm } from '../types';

interface AlgorithmSelectorProps {
  selectedAlgorithm: SchedulingAlgorithm;
  onAlgorithmChange: (algorithm: SchedulingAlgorithm) => void;
  timeQuantum: number;
  onTimeQuantumChange: (quantum: number) => void;
}

const algorithms = [
  { value: 'fcfs', label: 'First Come First Serve (FCFS)', description: 'Executes processes in arrival order' },
  { value: 'sjf', label: 'Shortest Job First (SJF)', description: 'Executes shortest processes first' },
  { value: 'rr', label: 'Round Robin (RR)', description: 'Time-sharing with fixed time quantum' },
  { value: 'priority', label: 'Priority (Non-Preemptive)', description: 'Executes highest priority processes first' },
  { value: 'priority-preemptive', label: 'Priority (Preemptive)', description: 'Can interrupt lower priority processes' }
];

export default function AlgorithmSelector({ 
  selectedAlgorithm, 
  onAlgorithmChange, 
  timeQuantum, 
  onTimeQuantumChange 
}: AlgorithmSelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Scheduling Algorithm</h2>
      
      <div className="space-y-4">
        {algorithms.map((algorithm) => (
          <label key={algorithm.value} className="flex items-start space-x-3 cursor-pointer">
            <input
              type="radio"
              name="algorithm"
              value={algorithm.value}
              checked={selectedAlgorithm === algorithm.value}
              onChange={(e) => onAlgorithmChange(e.target.value as SchedulingAlgorithm)}
              className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-800">{algorithm.label}</div>
              <div className="text-sm text-gray-600">{algorithm.description}</div>
            </div>
          </label>
        ))}
      </div>

      {selectedAlgorithm === 'rr' && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Quantum
          </label>
          <input
            type="number"
            min="1"
            value={timeQuantum}
            onChange={(e) => onTimeQuantumChange(parseInt(e.target.value) || 1)}
            className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-2 text-xs text-gray-600">
            Each process will execute for at most {timeQuantum} time unit{timeQuantum !== 1 ? 's' : ''} before switching.
          </p>
        </div>
      )}

      {(selectedAlgorithm === 'priority' || selectedAlgorithm === 'priority-preemptive') && (
        <div className="mt-6 p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> Higher numbers indicate higher priority. 
            {selectedAlgorithm === 'priority-preemptive' && 
              ' In preemptive mode, a higher priority process can interrupt a lower priority one.'
            }
          </p>
        </div>
      )}
    </div>
  );
}