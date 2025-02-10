import React, { useState, useEffect } from 'react';
import { saveTodosToLocalStorage, loadTodosFromLocalStorage } from './helper';
import { Tag, GripVertical, Filter } from 'lucide-react';

export default function App() {
  const [todos, setTodos] = useState(loadTodosFromLocalStorage());
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [repeat, setRepeat] = useState('daily');
  const [completedFilter, setCompletedFilter] = useState('all'); // For filtering by completed/incompleted
  const [repeatFilter, setRepeatFilter] = useState('all'); // For filtering by daily/weekly
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [draggedItemStyle, setDraggedItemStyle] = useState({});
  const [dragOverIndex, setDragOverIndex] = useState(null);

  useEffect(() => {
    resetRepeatTasks();
  }, [todos]);

  const handleAddTodo = () => {
    if (newName.trim() && newDescription.trim()) {
      const newTodo = {
        id: Date.now().toString(),
        name: newName,
        description: newDescription,
        completed: false,
        repeat,
        createdAt: Date.now(),
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

  // Reset repeat tasks based on daily or weekly intervals
  const resetRepeatTasks = () => {
    const currentTime = Date.now();
    const updatedTodos = todos.map((todo) => {
      if (todo.repeat !== 'none') {
        const timeDiff = currentTime - todo.createdAt;
        const isDueForReset =
          (todo.repeat === 'daily' && timeDiff >= 86400000) || // 24 hours in ms
          (todo.repeat === 'weekly' && timeDiff >= 604800000); // 7 days in ms

        if (isDueForReset) {
          return { ...todo, completed: false, createdAt: currentTime };
        }
      }
      return todo;
    });

    // Only update the state if there's an actual change
    const isUpdated = !updatedTodos.every((todo, index) => todo === todos[index]);
    if (isUpdated) {
      setTodos(updatedTodos);
      saveTodosToLocalStorage(updatedTodos);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    const isCompleted =
      completedFilter === 'completed' ? todo.completed : completedFilter === 'incompleted' ? !todo.completed : true;

    const isRepeat =
      repeatFilter === 'daily' ? todo.repeat === 'daily' : repeatFilter === 'weekly' ? todo.repeat === 'weekly' : true;

    return isCompleted && isRepeat;
  });

  const onDragStart = (index, e) => {
    if (!(completedFilter == "all" && repeatFilter == 'all')) return;
    setDraggedItemIndex(index);
    setDraggedItemStyle({
      transform: 'scale(1.1)',
      transition: 'transform 0.2s ease',
      opacity: 0.7,
    });
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (index, e) => {
    if (!(completedFilter == "all" && repeatFilter == 'all')) return;
    e.preventDefault();
    setDragOverIndex(index);
  };

  const onDrop = (index, e) => {
    if (!(completedFilter == "all" && repeatFilter == 'all')) return;
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

  const resetFilters = () => {
    setCompletedFilter('all');
    setRepeatFilter('all');
  };

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
          <select
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
            className="bg-[#3A3A3A] text-white p-2 rounded"
          >
            <option value="none">None</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
          <button
            onClick={handleAddTodo}
            className="whitespace-nowrap w-1/6 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded"
          >
            Add
          </button>
        </div>

        {/* Filter Section */}
        <div className="mb-4 flex gap-4 justify-between">
          <div className='text-white flex justify-center items-center'>
            <Filter size={20} />
          </div>
          <div>
            <label htmlFor="completedFilter" className="text-white mr-2">Completion:</label>
            <select
              id="completedFilter"
              value={completedFilter}
              onChange={(e) => setCompletedFilter(e.target.value)}
              className="bg-[#3A3A3A] text-white p-2 rounded"
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="incompleted">Incomplete</option>
            </select>
          </div>

          <div>
            <label htmlFor="repeatFilter" className="text-white mr-2">Repeat:</label>
            <select
              id="repeatFilter"
              value={repeatFilter}
              onChange={(e) => setRepeatFilter(e.target.value)}
              className="bg-[#3A3A3A] text-white p-2 rounded"
            >
              <option value="all">All</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <button
            onClick={resetFilters}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
          >
            Reset Filters
          </button>
        </div>

        <div className="space-y-4">
          {filteredTodos.map((todo, index) => (
            <div
              key={todo.id}
              className={`rounded-lg bg-[#3A3A3A] p-4 ${dragOverIndex === index ? 'bg-gray-600' : ''}`}
              onDragStart={(e) => onDragStart(index, e)}
              onDragOver={(e) => onDragOver(index, e)}
              onDrop={(e) => onDrop(index, e)}
              draggable
              style={{
                opacity: draggedItemIndex === index ? draggedItemStyle.opacity : 1,
                transform: draggedItemIndex === index ? draggedItemStyle.transform : 'scale(1)',
                transition: draggedItemIndex === index ? draggedItemStyle.transition : 'none',
              }}
            >
              <div className="flex items-center gap-4">
                <div className="cursor-pointer p-2 bg-gray-600 rounded text-white">
                  <GripVertical size={20} />
                </div>

                <div className="flex-1">
                  <h2 className={`text-xl font-semibold ${todo.completed ? 'text-gray-500 line-through' : 'text-orange-500'}`}>
                    {todo.name}
                  </h2>
                  <p className={`mt-1 ${todo.completed ? 'text-gray-600' : 'text-gray-300'}`}>
                    {todo.description}
                  </p>
                </div>

                <div className="flex gap-2 items-center">
                  {todo.repeat !== 'none' && (
                    <div className="mt-2">
                      <Tag color={todo.repeat === 'daily' ? 'green' : 'blue'}>
                        {todo.repeat === 'daily' ? 'Daily' : 'Weekly'}
                      </Tag>
                    </div>
                  )}
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
