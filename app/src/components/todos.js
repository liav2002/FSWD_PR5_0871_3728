import React, { useState, useEffect } from 'react';
import '../css/todos.css'; // Assuming you will create this CSS file

function Todos() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [todos, setTodos] = useState([]);
  const [nextId, setNextId] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('serial');
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [password, setPassword] = useState('');
  const [removeTodoId, setRemoveTodoId] = useState(null);

  useEffect(() => {
    fetchTodos();
    initNextId();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`http://localhost:8000/todos?userId=${user.id}`);
      const data = await response.json();
      setTodos(data);

      const maxId = Math.max(...data.map(todo => parseInt(todo.id, 10)));
      setNextId(maxId >= 0 ? maxId + 1 : 1);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const initNextId = async () => {
    try {
      const response = await fetch(`http://localhost:8000/todos/`);
      const data = await response.json();
      const maxId = Math.max(...data.map(todo => parseInt(todo.id, 10)));
      setNextId(maxId >= 0 ? maxId + 1 : 1);
    } catch (error) {
      console.error('Error initial next id:', error);
    }
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortedTodos = [...todos].sort((a, b) => {
    switch (sortOption) {
      case 'serial':
        return 0;
      case 'execution':
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;
        return new Date(a.execution) - new Date(b.execution);
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      case 'random':
        return Math.random() - 0.5;
      default:
        return 0;
    }
  });

  const toggleComplete = async (id) => {
    try {
      const todo = todos.find(todo => todo.id === id);
      const updatedTodo = { ...todo, completed: !todo.completed };
      await fetch(`http://localhost:8000/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTodo),
      });
      setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleRemoveTodo = async () => {
    if (password === user.password) {
      try {
        await fetch(`http://localhost:8000/todos/${parseInt(removeTodoId, 10)}`, {
          method: 'DELETE',
        });
  
        // Convert removeTodoId to string before comparison
        const idToRemove = removeTodoId.toString();
  
        // Filter out the todo with matching ID
        const updatedTodos = todos.filter(todo => todo.id !== idToRemove);
        setTodos(updatedTodos);
  
        // Reset states
        setRemoveTodoId(null);
        setPassword('');
      } catch (error) {
        console.error('Error removing todo:', error);
      }
    } else {
      alert('Incorrect password');
    }
  };

  const addTodo = async () => {
    const todoToAdd = { 
      userId: parseInt(user.id, 10),
      id: nextId.toString(),
      title: newTodoTitle, 
      completed: false
    };
    try {
      const response = await fetch(`http://localhost:8000/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoToAdd),
      });
      const addedTodo = await response.json();
      setTodos([...todos, addedTodo]);
      setShowAddTodo(false);
      setNewTodoTitle('');
      setNextId(nextId + 1);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const filteredTodos = sortedTodos.filter((todo) =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <div className="header">
        <div className="page-header">
          <h1 className="title">Todos</h1>
          <input
            type="text"
            className="search-input"
            placeholder="Search todos by title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select className="sort-select" value={sortOption} onChange={handleSortChange}>
            <option value="serial">Sort by Serial</option>
            <option value="execution">Sort by Complete</option>
            <option value="alphabetical">Sort Alphabetically</option>
            <option value="random">Sort Randomly</option>
          </select>
          <button className="add-todo-btn" onClick={() => setShowAddTodo(true)}>
            Add Todo
          </button>
        </div>
      </div>

      <div className="content">
        <ul className="todo-list">
            {filteredTodos.map((todo) => (
              <li key={todo.id} className="todo-item">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id)}
                />
                {todo.title}
                <button className="remove-btn" onClick={() => setRemoveTodoId(todo.id)}>Remove</button>
              </li>
            ))}
        </ul>
      </div>

      {showAddTodo && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="close"
              onClick={() => setShowAddTodo(false)}
            >
              &times;
            </span>
            <h2>Add New Todo</h2>
            <input
              type="text"
              placeholder="Text"
              value={newTodoTitle}
              onChange={(e) =>
                setNewTodoTitle(e.target.value)
              }
            />
            <button onClick={addTodo}>Add</button>
            <button onClick={() => setShowAddTodo(false)}>Cancel</button>
          </div>
        </div>
      )}

      {removeTodoId !== null && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setRemoveTodoId(null)}>&times;</span>
            <h2>Confirm Removal</h2>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleRemoveTodo}>Confirm</button>
            <button onClick={() => setRemoveTodoId(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Todos;
