import { useState } from "react";

const AddTask = ({ status, onAddTask }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [title, setTitle] = useState("")
    const [difficulty, setDifficulty] = useState("MEDIUM");

    const handleSubmit = (e) => {
        e.preventDefault()
        if (title.trim()) {
            onAddTask(title, status, difficulty);
            setTitle("");
            setDifficulty("MEDIUM");
            setIsEditing(false);
        }
    };

    if (isEditing) {
        return (
            <form className="add-task-form" onSubmit={handleSubmit}>
                <input
                autoFocus
                className="add-task-input"
                placeholder="add your task"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                /* Убираем onBlur, чтобы форма не закрывалась сама при клике на кнопку «Add» */
                />
                <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)}
                className="add-task-select"
                style={{
                    background: '#1a1a1a',
                    border: '1px solid #444',
                    borderRadius: '4px',
                    color: '#fff',
                    padding: '8px',
                    margin: '4px 0 8px 0',
                    outline: 'none',
                    width: '100%',
                    boxSizing: 'border-box',
                    fontSize: '14px'
                }}
            >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
            </select>

                <div className="add-task-actions">
                    {/* ИЗМЕНЕНО: класс confirm-add-btn заменен на add-confirm-btn */}
                    <button type="submit" className="add-confirm-btn">Add</button>
                    {/* ИЗМЕНЕНО: класс cancel-add-btn заменен на add-cancel-btn */}
                    <button type="button" className="add-cancel-btn" onClick={() => setIsEditing(false)}>✕</button>
                </div>
            </form>
        )
    }
    return (
        <button className="add-task-btn" onClick={() => setIsEditing(true)}>
            + Add task
        </button>
    )
}

export default AddTask;
