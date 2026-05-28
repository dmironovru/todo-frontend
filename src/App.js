import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = '/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_BASE);
      setTasks(res.data);
    } catch (err) {
      console.error('Ошибка загрузки:', err);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      await axios.post(API_BASE, { title: newTask, completed: false });
      setNewTask('');
      fetchTasks();
    } catch (err) {
      console.error('Ошибка добавления:', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`);
      fetchTasks();
    } catch (err) {
      console.error('Ошибка удаления:', err);
    }
  };

  const updateTask = async (id, completed) => {
    try {
      await axios.put(`${API_BASE}/${id}`, { completed });
      fetchTasks();
    } catch (err) {
      console.error('Ошибка обновления:', err);
    }
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.title);
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`${API_BASE}/${id}`, { title: editText });
      setEditingId(null);
      fetchTasks();
    } catch (err) {
      console.error('Ошибка сохранения:', err);
    }
  };

  return (
    <div className="App">
      <h1>📋 Список задач</h1>
      <div className="add-form">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Новая задача..."
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
        />
        <button onClick={addTask}>➕ Добавить</button>
      </div>

      <ul className="tasks-list">
        {tasks.map(task => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            {editingId === task.id ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={() => saveEdit(task.id)}
                onKeyPress={(e) => e.key === 'Enter' && saveEdit(task.id)}
                autoFocus
              />
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => updateTask(task.id, !task.completed)}
                />
                <span className="task-title" onDoubleClick={() => startEdit(task)}>
                  {task.title}
                </span>
                <button className="edit-btn" onClick={() => startEdit(task)}>✏️</button>
                <button className="delete-btn" onClick={() => deleteTask(task.id)}>🗑️</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;