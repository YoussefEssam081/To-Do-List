import { useState, useEffect } from "react";
import './TaskForm.css';

export default function TaskForm({ addTask, editTask, isEditing, isAdd, taskToEdit, tasks }) {
    const [taskForm, setTaskForm] = useState({
        id: '',
        title: '',
        dueDate: '',
        priority: 'Medium',
        completed: false,
    });

    useEffect(() => {
        if (isEditing && taskToEdit) {
            // Find the task by ID and set form values , it finds the corresponding task and sets the form fields to that task's values.
            const task = tasks.find(task => task.id === taskToEdit.id);
            if (task) {
                setTaskForm(task);
            }
        } else {
            setTaskForm({
                id: '',
                title: '',
                dueDate: '',
                priority: 'Medium',
                completed: false,
            });
        }
    }, [isEditing, taskToEdit, tasks]);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setTaskForm((prevTaskForm) => ({
            ...prevTaskForm, [name]: value,
        }));
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (isEditing) {
            editTask(taskForm.id, taskForm); // Pass the full taskForm to editTask
        } else if (isAdd) {
            const newTask = { ...taskForm, id: Date.now() };
            addTask(newTask);
        }

        // Reset form and modes after submission
        setTaskForm({
            id: '',
            title: '',
            dueDate: '',
            priority: 'Medium',
            completed: false,
        });
        // Optionally reset modes here if needed
    }

    return (
        
        (isEditing || isAdd) && (
            <form id="taskForm" className="task-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    value={taskForm.title}
                    onChange={handleOnChange}
                    placeholder="Task Title"
                    required
                />
                <input
                    type="date"
                    name="dueDate"
                    value={taskForm.dueDate}
                    onChange={handleOnChange}
                />
                <input
                    type="datetime-local"
                    value={taskForm.reminder}
                    onChange={handleOnChange}
                />
                <select
                    name="priority"
                    value={taskForm.priority}
                    onChange={handleOnChange}
                >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>

                <button type="submit">
                    {isEditing ? "Update Task" : "Add Task"}
                </button>
            </form>
        )
    );
}
