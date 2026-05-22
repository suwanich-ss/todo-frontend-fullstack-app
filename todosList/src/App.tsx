import { useEffect, useState } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo, } from './services/api';
import type { Todo } from './services/api';
import './App.css';

function App() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTodoText, setNewTodoText] = useState('');
    const [creating, setCreating] = useState(false);



    

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getTodos();
            setTodos(data);
        } catch (err) {
            setError('Failed to load todos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (creating) return; // Prevent multiple clicks
        setCreating(true);
        if (newTodoText && newTodoText.trim() !== '') {
            try{
                await createTodo(newTodoText.trim());
                setNewTodoText('');
                setIsModalOpen(false);
                fetchTodos();
            } catch (err) {
                setError('Failed to create todo');
            } finally {
                setCreating(false);
            }
        }
    };

    const handleUpdate = async (id: number, txt: string, completed: boolean) => {
        try {
            await updateTodo(id, txt, !completed);
            fetchTodos();
        } catch (err) {
            setError('Failed to update todo');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteTodo(id);
            fetchTodos();
        } catch (err) {
            setError('Failed to delete todo');
        }
    };

    const handleOpenModal =  () => {
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewTodoText('');
    };

    return (
        <div className="app">
            <div className="container">
                <h1> Todo List</h1>
                <button className="btn-add" onClick={handleOpenModal}>+ Add Todo</button>

                {error && <div className="error">{error}</div>}
                {loading && <p className="loading">Loading...</p>}

                {!loading && todos.length === 0 ? (
                    <p className="empty">No todos yet. Add one to get started!</p>
                ) : (
                    <ul className="todo-list">
                        {todos.map(todo => (
                            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => handleUpdate(todo.id, todo.txt, todo.completed)}
                                />
                                <span className="todo-text">{todo.txt}</span>
                                <button className='btn-delete' onClick={() => handleDelete(todo.id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                )}

                {isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2>Add New Todo</h2>
                            <input 
                            type="text"
                            value={newTodoText} 
                            onChange={(e) => setNewTodoText(e.target.value)}/>
                            <div className="modal_actions">
                                <button className={`btn ${creating ? 'btn-creating' : ''}`} onClick={handleCreate} disabled={creating}>
                                    {creating ? 'Creating...' : 'Create'}
                                </button>
                                <button className="btn btn-Cancel" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;