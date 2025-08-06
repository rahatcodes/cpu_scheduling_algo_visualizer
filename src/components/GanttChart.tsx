import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { GanttBlock } from '../types';

interface GanttChartProps {
  ganttChart: GanttBlock[];
  totalTime: number;
  isAnimating: boolean;
  onAnimationToggle: () => void;
  onReset: () => void;
}

export default function GanttChart({ 
  ganttChart, 
  totalTime, 
  isAnimating, 
  onAnimationToggle, 
  onReset 
}: GanttChartProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(100);

  useEffect(() => {
    let interval: number;
    if (isAnimating && currentTime < totalTime) {
      interval = window.setInterval(() => {
        setCurrentTime(prev => Math.min(prev + 0.1, totalTime));
      }, animationSpeed);
    }
    return () => clearInterval(interval);
  }, [isAnimating, currentTime, totalTime, animationSpeed]);

  useEffect(() => {
    if (currentTime >= totalTime && isAnimating) {
      onAnimationToggle();
    }
  }, [currentTime, totalTime, isAnimating, onAnimationToggle]);

  const handleReset = () => {
    setCurrentTime(0);
    onReset();
  };

  if (ganttChart.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Gantt Chart</h2>
        <div className="text-center py-12 text-gray-500">
          Add processes and select an algorithm to see the Gantt chart
        </div>
      </div>
    );
  }

  const scale = Math.min(800 / totalTime, 50);
  const chartWidth = Math.max(totalTime * scale, 400);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Gantt Chart</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-600">Speed:</label>
            <select
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
              className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={200}>0.5x</option>
              <option value={100}>1x</option>
              <option value={50}>2x</option>
              <option value={25}>4x</option>
            </select>
          </div>
          <button
            onClick={onAnimationToggle}
            className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {isAnimating ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                {currentTime >= totalTime ? 'Replay' : 'Play'}
              </>
            )}
          </button>
          <button
            onClick={handleReset}
            className="inline-flex items-center px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="relative" style={{ width: chartWidth, height: '120px' }}>
          {/* Timeline */}
          <div className="absolute top-0 left-0 right-0 h-8 border-b border-gray-300">
            {Array.from({ length: Math.ceil(totalTime) + 1 }, (_, i) => (
              <div
                key={i}
                className="absolute top-0 text-xs text-gray-600 flex flex-col items-center"
                style={{ left: i * scale }}
              >
                <div className="w-px h-2 bg-gray-400"></div>
                <span className="mt-1">{i}</span>
              </div>
            ))}
          </div>

          {/* Gantt bars */}
          <div className="absolute top-8 left-0 right-0 h-16">
            {ganttChart.map((block, index) => {
              const blockWidth = (block.endTime - block.startTime) * scale;
              const blockLeft = block.startTime * scale;
              const isVisible = currentTime >= block.startTime;
              const visibleWidth = Math.min(
                blockWidth,
                Math.max(0, (currentTime - block.startTime) * scale)
              );

              return (
                <div key={index} className="relative">
                  {/* Full block (background) */}
                  <div
                    className="absolute top-2 h-12 border-2 border-gray-300 bg-gray-100 rounded"
                    style={{
                      left: blockLeft,
                      width: blockWidth,
                    }}
                  />
                  
                  {/* Animated fill */}
                  {isVisible && (
                    <div
                      className="absolute top-2 h-12 rounded transition-all duration-75 ease-linear"
                      style={{
                        left: blockLeft,
                        width: visibleWidth,
                        backgroundColor: block.color,
                        border: `2px solid ${block.color}`,
                      }}
                    />
                  )}
                  
                  {/* Process label */}
                  <div
                    className="absolute top-2 h-12 flex items-center justify-center text-sm font-medium text-gray-800 pointer-events-none"
                    style={{
                      left: blockLeft,
                      width: blockWidth,
                    }}
                  >
                    {blockWidth > 30 ? block.processId : ''}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Current time indicator */}
          <div
            className="absolute top-0 w-px h-full bg-red-500 z-10 transition-all duration-75 ease-linear"
            style={{ left: currentTime * scale }}
          >
            <div className="absolute -top-2 -left-1 w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="absolute -bottom-4 -left-6 text-xs text-red-600 font-medium">
              {currentTime.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Process Legend */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Process Legend</h3>
        <div className="flex flex-wrap gap-3">
          {Array.from(new Set(ganttChart.map(block => block.processId))).map(processId => {
            const block = ganttChart.find(b => b.processId === processId)!;
            return (
              <div key={processId} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded border border-gray-300"
                  style={{ backgroundColor: block.color }}
                ></div>
                <span className="text-sm text-gray-600">{processId}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}