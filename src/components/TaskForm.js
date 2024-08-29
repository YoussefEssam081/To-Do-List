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

    // handles the logic for editing a task
    useEffect(() => {
        if (isEditing && taskToEdit) {
            // Find the task by ID and set form values
            // It finds the corresponding task and sets the form fields to that task's values.
            const task = tasks.find(task => task.id === taskToEdit.id);
            if (task) {
                setTaskForm(task);
            }
        } else {
            // Reset the form to default values if not editing or no task to edit
            setTaskForm({
                id: '',
                title: '',
                dueDate: '',
                priority: 'Medium',
                completed: false,
            });
        }
    }, [isEditing, taskToEdit, tasks]);

    // Function to handle input changes
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setTaskForm((prevTaskForm) => ({
            ...prevTaskForm,
            [name]: value,
        }));
    }

    // Function to handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();

        if (isEditing) {
            // If in edit mode, update the task with the current form values
            editTask(taskForm.id, taskForm); // Pass the full taskForm to editTask
        } else if (isAdd) {
            // If in add mode, create a new task with a unique ID and add it to the task list
            const newTask = { ...taskForm, id: Date.now() };
            addTask(newTask);
        }

        // Reset the form to its default state after submission
        setTaskForm({
            id: '',
            title: '',
            dueDate: '',
            priority: 'Medium',
            completed: false,
        });
        // Optionally reset modes here if needed (e.g., toggle isEditing or isAdd)
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
