import React, { useEffect, useState, useMemo } from 'react';
import './App.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { Tasks } from './components/Task';
import TaskChart from './components/TaskChart ';
import Navbar from './components/Navbar';

// Function to retrieve tasks from local storage or use default tasks if none are found
const getInitialTasks = () => {
  const savedTasks = localStorage.getItem('tasks');
  return savedTasks ? JSON.parse(savedTasks) : Tasks;
};

function App() {
  // State variables
  const [tasks, setTasks] = useState(getInitialTasks); // Tasks state
  const [isEditing, setIsEditing] = useState(false); // Editing mode state
  const [isAdd, setIsAdd] = useState(false); // Adding mode state
  const [taskToEdit, setTaskToEdit] = useState(null); // Task currently being edited
  const [filter, setFilter] = useState('all'); // Filter state (e.g., 'completed', 'pending', 'all')
  const [sort, setSort] = useState('date'); // Sort state (e.g., 'date', 'priority', 'title')
  const [lastDeletedTask, setLastDeletedTask] = useState(null); // Last deleted task for undo
  const [searchFilter, setSearchFilter] = useState({ title: '' }); // Search filter by title
  const [searchFilteredTasks, setSearchFilteredTasks] = useState([]); // Tasks filtered by search
  const [selectedTasks, setSelectedTasks] = useState({}); // Store selected tasks for bulk actions

  // Dark mode state with default value from local storage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // Effect to apply dark mode and save preference to local storage
  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-mode' : '';
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Toggle dark mode state
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // Effect to save tasks to local storage whenever tasks state changes
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task to the list
  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
    setIsAdd(false); // Hide the form after adding
  };

  // Edit an existing task by ID
  const editTask = (id, updatedTask) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, ...updatedTask } : task
    );
    setTasks(updatedTasks);
    setIsEditing(false); // Hide the form after editing
    setTaskToEdit(null); // Clear the task being edited
  };

  // Delete a task by ID and store it temporarily for potential undo
  const deleteTask = (id) => {
    const taskToDelete = tasks.find((task) => task.id === id);
    setLastDeletedTask(taskToDelete); // Store the deleted task

    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    deleteSelectedTasks(); // Clear selected tasks if bulk delete is used
  };

  // Undo the last deleted task by adding it back to the list
  const undoDelete = () => {
    if (lastDeletedTask) {
      setTasks([...tasks, lastDeletedTask]);
      setLastDeletedTask(null);
    }
  };

  // Scroll to the task form when adding or editing a task
  const handleScrollToForm = () => {
    setTimeout(() => {
      const formElement = document.getElementById('taskForm');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100); // Adjust timeout if needed
  };

  // Toggle edit mode for a specific task and scroll to the form
  const toggleEdit = (task) => {
    setIsEditing(true);
    setIsAdd(false); // Ensure add mode is off
    setTaskToEdit(task); // Set the task to be edited
    handleScrollToForm();
  };

  // Enable add mode and scroll to the form
  const toggleAdd = () => {
    setIsAdd(true);
    setIsEditing(false); // Ensure edit mode is off
    setTaskToEdit(null); // Clear any task being edited
    handleScrollToForm();
  };

  // Filter tasks based on the selected filter ('all', 'completed', 'pending')
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') {
      return task.completed;
    } else if (filter === 'pending') {
      return !task.completed;
    } else {
      return true; // 'all' filter shows all tasks
    }
  });

  // Sort tasks based on the selected sorting option ('date', 'priority', 'title')
  // Use useMemo to avoid re-sorting on every render
  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      if (sort === 'date') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sort === 'priority') {
        const priorities = { High: 1, Medium: 2, Low: 3 };
        return priorities[a.priority] - priorities[b.priority];
      } else if (sort === 'title') {
        return a.title.localeCompare(b.title);
      }
    });
  }, [filteredTasks, sort]);

  // Toggle task completion status by ID
  const toggleCompletion = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  // Handle task reminders and show alerts if the reminder date is due
  useEffect(() => {
    const checkReminders = () => {
      tasks.forEach((task) => {
        if (task.reminder && new Date(task.reminder) <= new Date()) {
          alert(`Reminder for task: ${task.title}`);
        }
      });
    };

    const intervalId = setInterval(checkReminders, 60000000); // Check reminders every .... time

    return () => clearInterval(intervalId); // Cleanup function to clear the interval
  }, [tasks]);

  // Filter tasks by title based on the search input
  const searchFilterByTitle = (event) => {
    const { value } = event.target;
    setSearchFilter({ title: value });

    // Filter tasks by title
    const filtered = tasks.filter((task) =>
      task.title.toLowerCase().includes(value.toLowerCase())
    );
    setSearchFilteredTasks(filtered);
  };

  // Handle selection of tasks for bulk actions
  const handleCheckboxChange = (taskId) => {
    setSelectedTasks((prevState) => ({
      ...prevState,
      [taskId]: !prevState[taskId], // Toggle selection for this specific taskId
    }));
  };

  // Delete all selected tasks
  const deleteSelectedTasks = () => {
    const updatedTasks = tasks.filter((task) => !selectedTasks[task.id]);
    setTasks(updatedTasks);

    // Clear selectedTasks after deletion
    setSelectedTasks({});
  };



  return (
    <div>
      <Navbar
        toggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
      />

      <div className="button-container-sort-filter">
        <div className="button-title">Filter Tasks</div>
        <button className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}>All</button>
        <button className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}>Completed</button>
        <button className={`filter-button ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}>Pending</button>
      </div>

      <div className="button-container-sort-filter">
        <div className="button-title">Sort Tasks</div>
        <button className={`sort-button ${sort === 'date' ? 'active' : ''}`}
          onClick={() => setSort('date')}>Sort by Date</button>
        <button className={`sort-button ${sort === 'priority' ? 'active' : ''}`}
          onClick={() => setSort('priority')}>Sort by Priority</button>
        <button className={`sort-button ${sort === 'title' ? 'active' : ''}`}
          onClick={() => setSort('title')}>Sort by Title</button>
      </div>

      <div class="search-container">
        <input
          type="text"
          name="title"
          placeholder="Search..."
          class="search-bar"
          value={searchFilter.title}
          onChange={searchFilterByTitle}
        />
        <button type="submit" class="search-button">Search</button>
      </div>

      <TaskForm
        addTask={addTask}
        editTask={editTask}
        isEditing={isEditing}
        isAdd={isAdd}
        taskToEdit={taskToEdit}
        tasks={tasks}
      />
      <TaskList
        tasks={searchFilter.title ? searchFilteredTasks : sortedTasks}
        deleteTask={deleteTask}
        toggleEdit={toggleEdit}
        toggleAdd={toggleAdd}
        toggleCompletion={toggleCompletion}
        handleCheckboxChange={handleCheckboxChange}
        selectedTasks={selectedTasks}
      />

      {lastDeletedTask && (
        <button onClick={undoDelete} className="undo-button">
          Undo Delete
        </button>
      )}
      <TaskChart tasks={tasks} />
    </div>
  );
}

export default App;
