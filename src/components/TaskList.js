import React from 'react';
import './TaskList.css';

export default function TaskList({ tasks, deleteTask, toggleEdit, toggleAdd, toggleCompletion }) {
    return (
        <div className="task-list">
            {tasks.length > 0 ? (
                tasks.map((task) => (
                    <div key={task.id} className="task-card">
                        <h3 className="task-title">{task.title}</h3>
                        <p className="task-due-date">Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
                        <p className={`task-priority priority-${task.priority.toLowerCase()}`}>
                            Priority: {task.priority}
                        </p>
                        <p className="task-status">
                            Status: {task.completed ? "Completed" : "Pending"}
                        </p>
                        {task.reminder && (
                            <p className="task-reminder">Reminder: {new Date(task.reminder).toLocaleString()}</p>
                        )}
                        <div className="button-container">
                            <button onClick={() => deleteTask(task.id)} className="btn-delete">Delete</button>
                            <button onClick={() => toggleEdit(task)} className="btn-edit">Edit</button>
                            <button onClick={toggleAdd} className="btn-add">Add</button>
                            <button onClick={() => toggleCompletion(task.id)} className="btn-complete">
                                {task.completed ? "Mark as Pending" : "Mark as Completed"}
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="no-tasks">No tasks available</div>
            )}
        </div>
    );
}
