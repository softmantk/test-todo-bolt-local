import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { 
  FaBars, 
  FaTrash, 
  FaEdit, 
  FaCheck, 
  FaRegCircle, 
  FaBell, 
  FaMoon,
  FaSun
} from 'react-icons/fa'

function App() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [editingTodo, setEditingTodo] = useState(null)
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [reminderDate, setReminderDate] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  // Status types
  const STATUS = {
    TODO: 'todo',
    IN_PROGRESS: 'in_progress',
    DONE: 'done'
  }

  // Responsive check
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
      // Auto-close sidebar on mobile
      if (window.innerWidth <= 768) {
        setSidebarVisible(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Dark mode persistence
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode)
  }, [darkMode])

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo = {
        id: uuidv4(),
        text: inputValue,
        status: STATUS.TODO,
        reminder: reminderDate ? new Date(reminderDate) : null,
        createdAt: new Date()
      }
      setTodos([...todos, newTodo])
      setInputValue('')
      setReminderDate('')
    }
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const updateTodoStatus = (id) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        const statusOrder = [STATUS.TODO, STATUS.IN_PROGRESS, STATUS.DONE]
        const currentIndex = statusOrder.indexOf(todo.status)
        const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length]
        return { ...todo, status: nextStatus }
      }
      return todo
    }))
  }

  const startEditing = (todo) => {
    setEditingTodo(todo)
    setInputValue(todo.text)
    setReminderDate(todo.reminder ? todo.reminder.toISOString().split('T')[0] : '')
  }

  const updateTodo = () => {
    if (inputValue.trim()) {
      setTodos(todos.map(todo => 
        todo.id === editingTodo.id 
          ? { 
              ...todo, 
              text: inputValue, 
              reminder: reminderDate ? new Date(reminderDate) : null 
            }
          : todo
      ))
      setEditingTodo(null)
      setInputValue('')
      setReminderDate('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      editingTodo ? updateTodo() : addTodo()
    }
  }

  // Color mapping for different statuses
  const getStatusColor = (status) => {
    switch(status) {
      case STATUS.TODO: return darkMode ? '#555' : 'gray'
      case STATUS.IN_PROGRESS: return darkMode ? '#3498db' : 'blue'
      case STATUS.DONE: return darkMode ? '#2ecc71' : 'green'
      default: return darkMode ? '#555' : 'gray'
    }
  }

  // Toggle sidebar for mobile
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible)
  }

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      {/* Theme Toggle */}
      <button 
        className="theme-toggle" 
        onClick={() => setDarkMode(!darkMode)}
        title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      {/* Sidebar Toggle for Mobile */}
      {isMobile && (
        <button 
          className="sidebar-toggle" 
          onClick={toggleSidebar}
        >
          <FaBars />
        </button>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${!sidebarVisible ? 'hidden' : ''} ${isMobile ? 'mobile' : ''}`}>
        <h2>Projects</h2>
        {isMobile && (
          <button 
            className="close-sidebar" 
            onClick={toggleSidebar}
          >
            ✕
          </button>
        )}
      </div>

      {/* Overlay for mobile sidebar */}
      {isMobile && sidebarVisible && (
        <div 
          className="sidebar-overlay" 
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content */}
      <div className="main-content">
        <div className="todo-input-container">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={editingTodo ? "Edit todo" : "Add a new todo"}
            className="todo-input-text"
          />
          <input 
            type="date" 
            value={reminderDate}
            onChange={(e) => setReminderDate(e.target.value)}
            className="todo-input-date"
          />
          <button onClick={editingTodo ? updateTodo : addTodo}>
            {editingTodo ? 'Update' : 'Add'}
          </button>
        </div>

        <ul className="todo-list">
          {todos.map(todo => (
            <li 
              key={todo.id} 
              className="todo-item"
              style={{ borderLeft: `5px solid ${getStatusColor(todo.status)}` }}
            >
              <div className="todo-content">
                <span>{todo.text}</span>
                {todo.reminder && (
                  <div className="todo-reminder">
                    <FaBell /> 
                    {todo.reminder.toLocaleDateString()}
                  </div>
                )}
              </div>
              
              <div className="todo-actions">
                <button 
                  onClick={() => updateTodoStatus(todo.id)}
                  title={`Current Status: ${todo.status}`}
                >
                  {todo.status === STATUS.TODO && <FaRegCircle />}
                  {todo.status === STATUS.IN_PROGRESS && <FaCheck />}
                  {todo.status === STATUS.DONE && '✓'}
                </button>
                
                <button onClick={() => startEditing(todo)}>
                  <FaEdit />
                </button>
                
                <button onClick={() => deleteTodo(todo.id)}>
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
