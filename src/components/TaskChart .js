import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, LineElement } from 'chart.js';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, LineElement);

const TaskChart = ({ tasks }) => {
    const taskPriorities = tasks.reduce((acc, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1;
        return acc;
    }, {});

    const taskCompletionStatus = tasks.reduce((acc, task) => {
        acc[task.completed ? 'Completed' : 'Pending'] = (acc[task.completed ? 'Completed' : 'Pending'] || 0) + 1;
        return acc;
    }, {});

    const priorityData = {
        labels: Object.keys(taskPriorities),
        datasets: [{
            label: 'Task Priorities',
            data: Object.values(taskPriorities),
            backgroundColor: ['red', 'orange', 'green'],
        }],
    };

    const completionData = {
        labels: Object.keys(taskCompletionStatus),
        datasets: [{
            label: 'Task Completion Status',
            data: Object.values(taskCompletionStatus),
            backgroundColor: ['blue', 'gray'],
        }],
    };

    return (
        <div className="chart-container">
        <h2>Task Priorities</h2>
        <Pie data={priorityData} />
        <h2>Task Completion Status</h2>
        <Bar
            data={completionData}
            options={{
                indexAxis: 'x',
                scales: {
                    x: { title: { display: true, text: 'Status' } },
                    y: { title: { display: true, text: 'Count' } },
                },
            }}
        />
    </div>
    );
};

export default TaskChart;
