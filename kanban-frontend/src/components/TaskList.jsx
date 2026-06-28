import React from "react";
import TaskItem from "./TaskItem";

const TaskList = ({ data, onStatusChange, onDeleteTask, onDeleteSubtask }) => {
    return (
        <div className="task-list-container">
            <ul className="task-list">
                {data.map((task) => (
                    <TaskItem 
                        key={task.id} 
                        task={task} 
                        onStatusChange={onStatusChange}
                        onDeleteTask={onDeleteTask}
                        onDeleteSubtask={onDeleteSubtask}
                    />
                ))}
            </ul>
        </div>
    );
};

export default TaskList;