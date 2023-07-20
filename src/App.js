import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs';
import { AiOutlineSave } from 'react-icons/ai';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editedTask, setEditedTask] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);

 useEffect (() => {
    axios
      .get('/user')
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
      });
  });

  const handleAddTask = () => {
    if (newTask.trim().length === 0) {
      window.alert('Task cannot be empty');
      return;
    }
    axios
      .post('/user', { title: newTask })
      .then((response) => {
        setTasks([...tasks, response.data]);
        setNewTask('');
      })
      .catch((error) => {
        console.error('Error creating task:', error);
      });
  };

  const handleDeleteTask = (id) => {
    axios
      .delete(`/user${id}`)
      .then(() => {
        setTasks(tasks.filter((task) => task._id !== id));
      })
      .catch((error) => {
        console.error('Error deleting task:', error);
      });
  };

  const handleEditTask = (id) => {
    const task = tasks.find((task) => task._id === id);
    setEditTaskId(id);
    setEditedTask(task.title);
  };

  const handleSaveTask = (id) => {
    if (editedTask.trim().length === 0) {
      window.alert('Task cannot be empty');
      return;
    }

    axios
      .put(`/user${id}`, { title: editedTask })
      .then((response) => {
        setTasks(
          tasks.map((task) =>
            task._id === id ? { ...task, title: editedTask } : task
          )
        );
        setEditTaskId(null);
        setEditedTask('');
      })
      .catch((error) => {
        console.error('Error updating task:', error);
      });
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAddTask();
    }
  };

  return (
    <div className='app1'>
      <p className='header1'>Add your Tasks </p>
      <div className='app2'>
        <input
          type='text'
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyPress}
          className='input1'
        />
        <br></br>
        <br></br>
        <button className='btn1' onClick={handleAddTask}>
          Add
        </button>
      </div>
      <div className='app3'>
        <p className='tasks1'>Your Tasks</p>
        <div className='app5'>
          <ul>
            {tasks.map((item) => (
              <div key={item._id} className='app4'>
                {editTaskId === item._id ? (
                  <input
                    type='text'
                    value={editedTask}
                    className='input3'
                    onChange={(e) => setEditedTask(e.target.value)}
                  />
                ) : (
                  <span className='span1'>{item.title}</span>
                )}
                <div className='btns2'>
                  {editTaskId === item._id ? (
                    <button
                      className='savebtn'
                      onClick={() => handleSaveTask(item._id)}
                    >
                      {<AiOutlineSave />}
                    </button>
                  ) : (
                    <button
                      className='editbtn'
                      onClick={() => handleEditTask(item._id)}
                    >
                      {<BsFillPencilFill />}
                    </button>
                  )}
                  <button
                    className='deletebtn'
                    onClick={() => handleDeleteTask(item._id)}
                  >
                    {<BsFillTrashFill />}
                  </button>
                </div>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
