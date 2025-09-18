import React, { useState, useEffect } from 'react';
import './App.css';
import AddTask from './components/AddTask';
import TaskList from './components/TaskList';
import { tasksAPI } from './api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load tasks from backend on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await tasksAPI.getTasks();
      setTasks(fetchedTasks);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (text) => {
    try {
      const newTask = await tasksAPI.createTask(text);
      setTasks([newTask, ...tasks]);
      setError(null);
    } catch (err) {
      setError('Failed to create task');
      console.error('Error creating task:', err);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      const updatedTask = await tasksAPI.updateTask(id, { completed: !task.completed });
      setTasks(tasks.map(t =>
        t.id === id ? updatedTask : t
      ));
      setError(null);
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await tasksAPI.deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>Tasks To-do</h1>
        </header>

        <main className="main-content">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <AddTask onAddTask={addTask} />

          {loading ? (
            <div className="loading">Loading tasks...</div>
          ) : (
            <TaskList
              tasks={tasks}
              onToggleComplete={toggleComplete}
              onDeleteTask={deleteTask}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
