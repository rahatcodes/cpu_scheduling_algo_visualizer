import React, { useState, useCallback, useEffect } from 'react';
import { Cpu, GitBranch } from 'lucide-react';
import ProcessForm from './components/ProcessForm';
import AlgorithmSelector from './components/AlgorithmSelector';
import GanttChart from './components/GanttChart';
import ResultsDisplay from './components/ResultsDisplay';
import { Process, SchedulingResult, SchedulingAlgorithm } from './types';
import { runSchedulingAlgorithm } from './utils/schedulingAlgorithms';

const initialProcesses: Process[] = [
  { id: 'P1', arrivalTime: 0, burstTime: 4, priority: 2 },
  { id: 'P2', arrivalTime: 1, burstTime: 3, priority: 1 },
  { id: 'P3', arrivalTime: 2, burstTime: 1, priority: 3 },
  { id: 'P4', arrivalTime: 3, burstTime: 2, priority: 2 }
];

function App() {
  const [processes, setProcesses] = useState<Process[]>(initialProcesses);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SchedulingAlgorithm>('fcfs');
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [result, setResult] = useState<SchedulingResult | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const needsPriority = selectedAlgorithm === 'priority' || selectedAlgorithm === 'priority-preemptive';

  const runScheduling = useCallback(() => {
    if (processes.length === 0) {
      alert('Please add at least one process');
      return;
    }

    try {
      const schedulingResult = runSchedulingAlgorithm(selectedAlgorithm, processes, timeQuantum);
      setResult(schedulingResult);
      setIsAnimating(false);
    } catch (error) {
      console.error('Error running scheduling algorithm:', error);
      alert('Error running scheduling algorithm. Please check your input.');
    }
  }, [processes, selectedAlgorithm, timeQuantum]);

  useEffect(() => {
    if (processes.length > 0) {
      runScheduling();
    }
  }, [processes, selectedAlgorithm, timeQuantum, runScheduling]);

  const handleAnimationToggle = () => {
    setIsAnimating(!isAnimating);
  };

  const handleReset = () => {
    setIsAnimating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CPU Scheduler Visualizer</h1>
                <p className="text-sm text-gray-600">Interactive scheduling algorithm simulator</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <GitBranch className="w-4 h-4" />
              <span>Multiple Algorithms</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Configuration */}
          <div className="lg:col-span-1 space-y-6">
            <AlgorithmSelector
              selectedAlgorithm={selectedAlgorithm}
              onAlgorithmChange={setSelectedAlgorithm}
              timeQuantum={timeQuantum}
              onTimeQuantumChange={setTimeQuantum}
            />
            
            <ProcessForm
              processes={processes}
              onProcessesChange={setProcesses}
              needsPriority={needsPriority}
            />
          </div>

          {/* Right Column - Visualization and Results */}
          <div className="lg:col-span-2 space-y-6">
            <GanttChart
              ganttChart={result?.ganttChart || []}
              totalTime={result?.totalTime || 0}
              isAnimating={isAnimating}
              onAnimationToggle={handleAnimationToggle}
              onReset={handleReset}
            />
            
            <ResultsDisplay
              result={result}
              algorithm={selectedAlgorithm}
              timeQuantum={timeQuantum}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>CPU Scheduling Algorithm Visualizer - Interactive learning tool for operating systems concepts</p>
            <p className="mt-1">Supports FCFS, SJF, Round Robin, and Priority scheduling algorithms</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;