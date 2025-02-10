import React, { useState } from 'react';
import { loadTodosFromLocalStorage, saveTodosToLocalStorage } from './helper';

export default function Prac() {
  const [todos, setTodos] = useState(loadTodosFromLocalStorage());
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [draggedItemStyle, setDraggedItemStyle] = useState({});
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [filter, setFilter] = useState('all'); 

  const onDragStart = (index, e) => {
    setDraggedItemIndex(index);
    setDraggedItemStyle({
      transform: 'scale(1.1)',
      transition: 'transform 0.2s ease',
      opacity: 0.7,
    });
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (index, e) => {
    e.preventDefault();
    setDragOverIndex(index);
    console.log("2");
  };

  const onDrop = (index, e) => {
    e.preventDefault();
    if (draggedItemIndex === index) {
      resetDragState();
      return;
    }

    const updatedTodos = [...todos];
    const [movedTodo] = updatedTodos.splice(draggedItemIndex, 1);
    updatedTodos.splice(index, 0, movedTodo);

    setTodos(updatedTodos);
    saveTodosToLocalStorage(updatedTodos);
    resetDragState();
  };

  const resetDragState = () => {
    setDraggedItemIndex(null);
    setDraggedItemStyle({});
    setDragOverIndex(null);
  };

  const handleAddTodo = () => {
    if (newName.trim() && newDescription.trim()) {
      const newTodo = {
        id: Date.now().toString(),
        name: newName,
        description: newDescription,
        completed: false,
      };
      const updatedTodos = [newTodo, ...todos];
      setTodos(updatedTodos);
      saveTodosToLocalStorage(updatedTodos);
      setNewName('');
      setNewDescription('');
    }
  };

  const toggleComplete = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    saveTodosToLocalStorage(updatedTodos);
  };

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    saveTodosToLocalStorage(updatedTodos);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'completed') {
      return todo.completed;
    }
    if (filter === 'incompleted') {
      return !todo.completed;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#2A2A2A] p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-white">My Todos</h1>

        <div className="mb-6 flex items-center gap-4">
          <input
            type="text"
            placeholder="Title"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="bg-[#3A3A3A] w-2/6 text-white placeholder:text-gray-400 p-2 rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="bg-[#3A3A3A] w-1/2 text-white placeholder:text-gray-400 p-2 rounded"
          />
          <button
            onClick={handleAddTodo}
            className="whitespace-nowrap w-1/6 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded"
          >
            Add
          </button>
        </div>

        {/* Filter Dropdown */}
        <div className="mb-4">
          <label htmlFor="filter" className="text-white mr-2">Filter:</label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#3A3A3A] text-white p-2 rounded"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="incompleted">Incomplete</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredTodos.map((todo, index) => (
            <div
              key={todo.id}
              className={`rounded-lg bg-[#3A3A3A] p-4 ${
                dragOverIndex === index ? 'bg-gray-600' : ''
              }`}
              onDragStart={(e) => onDragStart(index, e)}
              onDragOver={(e) => onDragOver(index, e)}
              onDrop={(e) => onDrop(index, e)}
              draggable
              style={{
                opacity: draggedItemIndex === index ? draggedItemStyle.opacity : 1,
                transform:
                  draggedItemIndex === index ? draggedItemStyle.transform : 'scale(1)',
                transition:
                  draggedItemIndex === index ? draggedItemStyle.transition : 'none',
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="cursor-pointer p-2 bg-gray-600 rounded"
                  onDragStart={(e) => onDragStart(index, e)}
                  draggable
                >
                  <span className="block w-2.5 h-0.5 bg-white mb-1"></span>
                  <span className="block w-2.5 h-0.5 bg-white mb-1"></span>
                  <span className="block w-2.5 h-0.5 bg-white"></span>
                </div>

                <div className="flex-1">
                  <h2
                    className={`text-xl font-semibold ${
                      todo.completed ? 'text-gray-500 line-through' : 'text-orange-500'
                    }`}
                  >
                    {todo.name}
                  </h2>
                  <p
                    className={`mt-1 ${
                      todo.completed ? 'text-gray-600' : 'text-gray-300'
                    }`}
                  >
                    {todo.description}
                  </p>
                </div>

                <div className="flex gap-2 items-center">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      todo.completed ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  ></div>
                  <button
                    onClick={() => toggleComplete(todo.id)}
                    className="bg-green-500/10 text-green-500 hover:bg-green-500/20 p-2 rounded"
                  >
                    {todo.completed ? 'Completed' : 'Complete'}
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="bg-red-500/10 text-red-500 hover:bg-red-500/20 p-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
