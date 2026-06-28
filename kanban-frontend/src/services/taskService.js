import api from "../api"


const getTasks = async () => {
    const response = await api.get("api/tasks/")
    return response.data
};


const updateTask = async (taskId, newStatus) => {
    const response = await api.patch(`api/tasks/${taskId}/`, {
        status: newStatus,
    });
    return response.data
};

const createTask = async(taskData) => {
    const response = await api.post('api/tasks/', taskData)
    return response.data
}


const deleteTask = async (taskId) => {
    const response = await api.delete(`api/tasks/${taskId}/`)
};



const createSubtask = async (title, taskId) => {
    const response = await api.post("api/subtasks/", {
        title: title,
        task: taskId
    });
    return response.data;

};

const deleteSubtask = async (subtaskId) => {
    await api.delete(`api/subtasks/${subtaskId}/`);
};



const updateSubtaskStatus = async (subtaskId, isCompleted) => {
    const response = await api.patch(`api/subtasks/${subtaskId}/`, {
        is_completed: isCompleted
    });
    return response.data;
};

export { getTasks, updateTask, deleteTask, createTask, createSubtask, deleteSubtask, updateSubtaskStatus };
