import React, { useState } from "react";
import { createSubtask, updateSubtaskStatus, deleteTask } from "../services/taskService";

const STATUSES = ["TO DO", "IN PROGRESS", "IN REVIEW", "DONE"];

const TaskItem = ({ task, onStatusChange, onDeleteTask, onDeleteSubtask }) => {
    const [subtasks, setSubtasks] = useState(task.subtasks || []);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
    const [loading, setLoading] = useState(false);

    const currentStatusIndex = STATUSES.indexOf(task.status);

    // Функция для перемещения задачи влево или вправо по колонкам
    const moveTask = (direction) => {
        const newIndex = currentStatusIndex + direction;
        // Проверяем, чтобы не выйти за границы колонок (левее TO DO или правее DONE)
        if (newIndex >= 0 && newIndex < STATUSES.length) {
            const nextStatus = STATUSES[newIndex];
            onStatusChange(task.id, nextStatus);
        }
    };


    const handleAddSubtask = async (e) => {
        e.preventDefault();
        if (!newSubtaskTitle.trim()) return;

        setLoading(true);
        try {
            const createdSub = await createSubtask(newSubtaskTitle, task.id);
            setSubtasks([...subtasks, createdSub])
            setNewSubtaskTitle("");
        } catch (error) {
            console.error("Ошибка добавления подзадачи:", error)
            alert("Не удалось сохранить подзадачу на сервере")
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveSubtask = async (subtaskId) => {
        setSubtasks(prev => prev.filter(sub => sub.id !== subtaskId))

        try {
            await onDeleteSubtask(task.id, subtaskId);
        } catch (error) {
            console.error("Не удалось удалить подзадачу:", error);
            setSubtasks(task.subtasks || []);
        }
    }

    return (
        <div className="task-item">
            <div className="task-header">
                {/* 1. Название задачи остаётся гордо стоять слева */}
                <h4 className="task-title">{task.title}</h4>

                {/* 2. Бадж и Корзину объединяем в группу справа */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`badge ${task.difficulty.toLowerCase()}`}>
                        {task.difficulty}
                    </span>
                    
                    <button 
                        className="delete-task-btn"
                        onClick={() => {
                            if (window.confirm(`Удалить задачу "${task.title}"?`)) {
                                onDeleteTask(task.id);
                            }
                        }}
                        title="Удалить задачу"
                    >
                        <svg 
                            xmlns="http://w3.org" /* Исправлен w3.org адрес */
                            viewBox="0 0 24 24" 
                            width="16" 
                            height="16" 
                            fill="currentColor"
                        >
                            <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>
                        </svg>
                    </button>
                </div>
            </div>

            {/* ... Твой неизмененный код подзадач и стрелочек ... */}
            <div className="subtasks-container">
                {subtasks.length > 0 && (
                    <ul className="subtasks-list">
                        {subtasks.map((sub) => (
                            <li key={sub.id} className="subtask-item">
                                <label className="subtask-label">
                                    <input
                                    type="checkbox"
                                    className="subtask-checkbox"
                                    checked={sub.is_completed || false}
                                    onChange={async (e) => {
                                        const currentChecked = e.target.checked;
                                        setSubtasks(prev => prev.map(s => s.id === sub.id ? {...s, is_completed: currentChecked} : s));

                                        try {
                                            await updateSubtaskStatus(sub.id, currentChecked);
                                        } catch (error) {
                                            console.error("Не удалось сохранить статус подзадачи:", error)
                                            setSubtasks(prev => prev.map(s => s.id === sub.id ? {...s, is_completed: !currentChecked} : s))
                                        }
                                    }}
                                    />
                                    <span className="subtask-text" style={{ textDecoration: sub.is_completed ? 'line-through' : 'none', opacity: sub.is_completed ? 0.5 : 1 }}>
                                        {sub.title}
                                    </span>
                                </label>

                                <button
                                    className="delete-subtask-btn"
                                    onClick={() => handleRemoveSubtask(sub.id)}
                                    title="Удалить подзадачу"
                                    type="button"
                                >
                                    &times;
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                <form onSubmit={handleAddSubtask} className="subtask-form">
                    <input
                        type="text"
                        placeholder="+ Добавить подзадачу"
                        value={newSubtaskTitle}
                        onChange={(e) => setNewSubtaskTitle(e.target.value)}
                        disabled={loading}
                        className="subtask-input"
                    />
                </form>
            </div>

            <div className="task-controls">
                {currentStatusIndex > 0 && (
                    <button className="arrow-btn" onClick={() => moveTask(-1)}>←</button>
                )}
                {currentStatusIndex < STATUSES.length - 1 && (
                    <button className="arrow-btn" onClick={() => moveTask(1)}>→</button>
                )}
            </div>
        </div>
    );
}
export default TaskItem;
