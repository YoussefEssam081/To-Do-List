

import React, { useEffect, useState } from 'react';
import './App.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { Tasks } from './components/Task';



function App() {

    const [tasks, setTasks] = useState(Tasks);
    const [undo, setundo] = useState(unll);
    const [filter, setFilter] = useState("all");
    const [sort, setSort] = ["data"];



    const addtask = (updatetask) => {

        setTasks(prev => [...tasks, updatetask])
    }


    const deletetask = (id) => {

        const undo = tasks.find(task => task.id == id)
        setundo(undo);

        const deleted = tasks.filter(task => task.id != id)
        setTasks(deleted);
    }


    const filtertask = () => {

        if (filter === "completed") { return tasks.completed; }
        else if (filter === "pendgin") { return !tasks.completed }
        else
            return true;
    }
    const sorttask = [...filteredTasks].sort((a, b) => {

        if (sort === "data") {
            return new Date(a.dudate) - new Date(b.dudate);
        }
        else if (sort === "priority") {
            const newValueForPriority = { "High": 1, "Medium": 2, "Low": 3 };
            return newValueForPriority[a.priority] - newValueForPriority[b.priority];
        }
        else if (sort === "title") {
            return a.title.localeCompare(b.title);
        }


    })



     const edit = ( id ,updatedit) => {

         const edittask = tasks.map(task => task.id === id ? [...tasks, ...updatedit] : task) ;
         

     }



    const markComplet =(id) => {

         const completedtask = tasks.map(task =>  task.id === id ? [...tasks, !task.completed]  : task ) ;
         setTasks(completedtask)
    }

    useEffect(( ) => {

       const reminder = () => {
        if (tasks.reminder && new Date(tasks.reminder) <= new Date())
        {
            alert(`Reminder for task: ${task.title}`);
        }
       }

      const interval = setInterval(reminder , 60000 )


      return () => clearInterval(interval);

    },[tasks])

    return (
        <div>
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
        </div>
    );
}

export default App;
