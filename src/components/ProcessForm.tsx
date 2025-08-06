import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Process } from '../types';

interface ProcessFormProps {
  processes: Process[];
  onProcessesChange: (processes: Process[]) => void;
  needsPriority: boolean;
}

export default function ProcessForm({ processes, onProcessesChange, needsPriority }: ProcessFormProps) {
  const [newProcess, setNewProcess] = useState({
    id: '',
    arrivalTime: 0,
    burstTime: 1,
    priority: 1
  });

  const addProcess = () => {
    if (!newProcess.id.trim()) {
      alert('Please enter a process ID');
      return;
    }

    if (processes.some(p => p.id === newProcess.id)) {
      alert('Process ID already exists');
      return;
    }

    const process: Process = {
      id: newProcess.id,
      arrivalTime: newProcess.arrivalTime,
      burstTime: newProcess.burstTime,
      ...(needsPriority && { priority: newProcess.priority })
    };

    onProcessesChange([...processes, process]);
    setNewProcess({
      id: `P${processes.length + 2}`,
      arrivalTime: 0,
      burstTime: 1,
      priority: 1
    });
  };

  const removeProcess = (id: string) => {
    onProcessesChange(processes.filter(p => p.id !== id));
  };

  const updateProcess = (id: string, field: keyof Process, value: number | string) => {
    onProcessesChange(processes.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Process Configuration</h2>
      
      {/* Add New Process */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Add New Process</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Process ID</label>
            <input
              type="text"
              value={newProcess.id}
              onChange={(e) => setNewProcess({ ...newProcess, id: e.target.value })}
              placeholder={`P${processes.length + 1}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Arrival Time</label>
            <input
              type="number"
              min="0"
              value={newProcess.arrivalTime}
              onChange={(e) => setNewProcess({ ...newProcess, arrivalTime: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Burst Time</label>
            <input
              type="number"
              min="1"
              value={newProcess.burstTime}
              onChange={(e) => setNewProcess({ ...newProcess, burstTime: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {needsPriority && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Priority</label>
              <input
                type="number"
                min="1"
                value={newProcess.priority}
                onChange={(e) => setNewProcess({ ...newProcess, priority: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>
        <button
          onClick={addProcess}
          className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Process
        </button>
      </div>

      {/* Process List */}
      {processes.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Current Processes</h3>
          <div className="space-y-3">
            {processes.map((process) => (
              <div key={process.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Process ID</label>
                    <input
                      type="text"
                      value={process.id}
                      onChange={(e) => updateProcess(process.id, 'id', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Arrival Time</label>
                    <input
                      type="number"
                      min="0"
                      value={process.arrivalTime}
                      onChange={(e) => updateProcess(process.id, 'arrivalTime', parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Burst Time</label>
                    <input
                      type="number"
                      min="1"
                      value={process.burstTime}
                      onChange={(e) => updateProcess(process.id, 'burstTime', parseInt(e.target.value) || 1)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  {needsPriority && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Priority</label>
                      <input
                        type="number"
                        min="1"
                        value={process.priority || 1}
                        onChange={(e) => updateProcess(process.id, 'priority', parseInt(e.target.value) || 1)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeProcess(process.id)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                  title="Remove process"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}