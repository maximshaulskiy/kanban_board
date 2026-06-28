import React from "react";
import TaskList from "./TaskList";
import AddTask from "./AddTask";
import "../App.css";

const STATUSES = ["TO DO", "IN PROGRESS", "IN REVIEW", "DONE"];

const KanbanBoard = ({ data, onStatusChange, onAddTask, onDeleteTask, onDeleteSubtask }) => {
    return (
        <div className="kanban-container">
            {STATUSES.map((status) => (
                <div key={status} className="kanban-column">
                    <div className="column-header">
                        <h3 className="column-title">{status}</h3>
                        <span className="task-count">
                            {data.filter(t => t.status === status).length}
                        </span>
                    </div>
                    {/* Передаем функцию изменения статуса дальше внутрь списков */}
                    <TaskList 
                        data={data.filter(task => task.status === status)} 
                        onStatusChange={onStatusChange} 
                        onDeleteTask={onDeleteTask}
                        onDeleteSubtask={onDeleteSubtask}
                    />
                    <AddTask status={status} onAddTask={onAddTask} />
                </div>
            ))}
        </div>
    );
};

export default KanbanBoard;
