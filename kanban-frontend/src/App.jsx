import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect, Children } from "react";
import { getTasks, updateTask, createTask, deleteTask, deleteSubtask } from "./services/taskService";
import KanbanBoard from "./components/KanbanBoard";
import { arrayMove } from "@dnd-kit/sortable";
import "./App.css"
import AddTask from "./components/AddTask";
import Login from "./components/Login";
import Register from "./components/Register";
import Activate from "./components/Activate";


function App() {
  const [data, setData] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const navigate = useNavigate();

  const handleLoginSuccess = (accessToken, refreshToken) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken)

    setToken(accessToken);
    navigate("/");
  }

  // Загрузка задач с сортировкой по порядку
  const loadTasks = async () => {
    try {
      const tasks = await getTasks();
      // Обязательно сортируем, иначе после перезагрузки порядок будет случайным
      setData(tasks.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error("Ошибка загрузки:", error);
    }
  };

  useEffect(() => {
    if (token) {
      loadTasks();
    }
  }, [token]);

  const updateTaskStatus = async (taskId, newStatus) => {
      // Шаг 1: Оптимистично и ЖЕЛЕЗНО двигаем карточку на фронте (ОДИН ререндер)
      setData((prevData) => {
        const tasksInNewColumn = prevData.filter(task => task.status === newStatus);
        const nextOrder = tasksInNewColumn.length + 1;

        return prevData
          .map((task) =>
            task.id == taskId ? { ...task, status: newStatus, order: nextOrder } : task
          )
          .sort((a, b) => a.order - b.order);
      });

      try {
        // Шаг 2: Просто уведомляем бэкенд. Бэк у себя в БД все пересчитает и сохранит.
        // Нам не нужно повторно дергать стейт фронтенда, ведь мы И ТАК уже поставили правильный order!
        await updateTask(taskId, newStatus);
        
      } catch (error) {
        console.error("Ошибка при обновлении статуса:", error);
        loadTasks(); // Если сервер упал — только тогда откатываем стейт назад к БД
      }
    };
  


  const handleAddTask = async (title, status, difficulty) => {
    try {
      // 1. Отправляем только title и status. Бэк сам посчитает идеальный order
      const newTask = await createTask({ title, status, difficulty });
      
      // 2. Добавляем новую задачу в массив и обязательно сортируем, 
      // чтобы она сразу встала на правильное место
      setData((prevData) => [...prevData, newTask].sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error("Ошибка при создании задачи:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);

      setData((prevData) => prevData.filter((task) => task.id != taskId));
    } catch (error) {
      console.error("Ошибка при удалении задачи:", error);
      alert("Не удалось удалить задачу на сервере");
    }
  };

  const handleDeleteSubtask = async (taskId, subtaskId) => {
    setData((prevData) =>
      prevData.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: task.subtasks.filter((sub) => sub.id !== subtaskId)
          };
        }
        return task;
      })
    )

    try {
      await deleteSubtask(subtaskId);
    } catch (error) {
      console.error("Ошибка при удалении подзадачи:", error);
      loadTasks();
    }
  }

  const PublicRoute = ({token, children}) => {
    if (token) {
      return <Navigate to="/" replace />
    }
    return children
  }


  return (
    <Routes>
      <Route path="/login" element={<PublicRoute token={token}><Login onLoginSuccess={handleLoginSuccess}/></PublicRoute>} />
      <Route path="/register" element={<PublicRoute token={token}><Register /></PublicRoute>} />
      <Route 
        path="/" 
        element={
          token ? (
            <div className="app-container">
              <h1 className="app-title">Мои Задачи</h1>
              <KanbanBoard data={data} onStatusChange={updateTaskStatus} onAddTask={handleAddTask} onDeleteTask={handleDeleteTask} onDeleteSubtask={handleDeleteSubtask}/>
            </div>
          ) : (
            <Navigate to="/login" /> // Если токена нет, перекидываем на логин
          )
        } 
      />
      <Route path="/activate/:uid/:token" element={<Activate />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;