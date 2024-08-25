import React, { useEffect, useState } from 'react';
import './App.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { Tasks } from './components/Task';
import TaskChart from './components/TaskChart ';
import Navbar from './components/Navbar';

// Load tasks from local storage or use default tasks
const getInitialTasks = () => {
  const savedTasks = localStorage.getItem('tasks');
  return savedTasks ? JSON.parse(savedTasks) : Tasks;
};

function App() {
  const [tasks, setTasks] = useState(getInitialTasks);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'completed', 'pending'
  const [sort, setSort] = useState('date'); // 'date', 'priority', 'title'
  const [lastDeletedTask, setLastDeletedTask] = useState(null); // Store the deleted task temporarily
  const [searchFilter, setSearchFilter] = useState({ title: '' });
  const [searchFilteredTasks, setSearchFilteredTasks] = useState([]);

  
  //  Toggle Dark Mode

  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Get the saved mode from localStorage
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false; // return back is false caz in value in localStorage yet. then when u press on the button it will return true caz the useeffect aleady render and setvalue in localStorage so it will back with true value .
  });

  useEffect(() => {
    // Apply the dark mode class based on the state
    document.body.className = isDarkMode ? 'dark-mode' : '';
    // Save the current mode in localStorage
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    console.log('isDarkMode state changed:', isDarkMode);
    console.log('New mode stored in localStorage:', localStorage.getItem('darkMode'));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };


  // Save tasks to local storage whenever they change
  useEffect(() => {

    setIsDarkMode(prevMode => !prevMode);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);



  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
    setIsAdd(false); // Hide form after adding
  };

  const editTask = (id, updatedTask) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, ...updatedTask } : task
    );
    setTasks(updatedTasks);
    setIsEditing(false); // Hide form after editing
    setTaskToEdit(null); // Clear the task being edited
  };

  const deleteTask = (id) => {

    const taskToDelete = tasks.find(task => task.id === id);
    setLastDeletedTask(taskToDelete); // Store the deleted task temporarily

    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  const undoDelete = () => {

    if (lastDeletedTask) {
      setTasks([...tasks, lastDeletedTask]);
      setLastDeletedTask(null);
    }
  }

  const handleScrollToForm = () => {
    setTimeout(() => {
      const formElement = document.getElementById('taskForm');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100); // Adjust timeout as necessary
  };

  const toggleEdit = (task) => {
    setIsEditing(true);
    setIsAdd(false); // Ensure add mode is off
    setTaskToEdit(task); // pass task value to state for compare them in form to get value
    handleScrollToForm();
  };

  const toggleAdd = () => {
    setIsAdd(true);
    setIsEditing(false); // Ensure edit mode is off
    setTaskToEdit(null); // Clear the task being edited
    handleScrollToForm();
  };

  // Filtering Tasks 

  const filteredTasks = tasks.filter((task) => {

    if (filter === "completed") { return task.completed; }
    else if (filter === "pending") { return !task.completed }
    else { return true; } // 'all' filter shows all tasks

  });

  // Sorting Tasks 

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort === 'date') {
      return new Date(a.dueDate) - new Date(b.dueDate);
    } else if (sort === 'priority') {
      const priorities = { "High": 1, "Medium": 2, "Low": 3 };
      return priorities[a.priority] - priorities[b.priority];
    } else if (sort === 'title') {
      return a.title.localeCompare(b.title);
    }
  });

  // provide a way to mark tasks as completed.

  const toggleCompletion = (id) => {

    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    )
    setTasks(updatedTasks);
  }

  //Handle Reminders
  // why use task.reminder inside data for 
  //When comparing dates, you need to use JavaScript’s Date object to ensure accurate and meaningful comparisons. 

  useEffect(() => {
    const checkReminders = () => {
      tasks.forEach(task => {
        if (task.reminder && new Date(task.reminder) <= new Date()) {
          alert(`Reminder for task: ${task.title}`);
        }
      })
    }

    const intervalId = setInterval(checkReminders, 6000000000)  // Check reminders based on specific time

    // Cleanup function to clear the interval

    return () => clearInterval(intervalId);
  }, [tasks]);  // Dependency array to re-run effect when tasks change


  // search on tasks by title
  const searchFIlterByTitle = (event) => {

    const { value } = event.target;
    setSearchFilter({ title: value });

    // Filter tasks by title
    const filtered = tasks.filter((task) =>
      task.title.toLowerCase().includes(value.toLowerCase())
    );
    setSearchFilteredTasks(filtered);
  }


  

  return (
    <div>
      <Navbar
      toggleDarkMode={toggleDarkMode}
      isDarkMode={isDarkMode}
       />
      <h1 className='title_to_do_list'>My To-Do List</h1>

      

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
          onChange={searchFIlterByTitle}
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
