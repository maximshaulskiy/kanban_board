import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import "./Activate.css"


const Activate = () => {
    const { uid, token } = useParams()
    const navigate = useNavigate()
    const [status, setStatus] = useState("Активация...")

    useEffect(() => {
        const activateAccount = async () => {
            try {
                await api.post("/auth/users/activation/", {uid, token})
                setStatus("Аккаунт успешно подтвержден! Перенаправляем на вход...")
                setTimeout(() => navigate("/login"), 3000)
            } catch(err) {
                setStatus("Ошибка активации. Ссылка устарела или неверна.")
            }
        }
        activateAccount()
    }, [uid, token, navigate])

    return (
        <div className="activate-container">
            <div className="activate-status">
                <h2>{status}</h2>
            </div>
        </div>
    )
}


export default Activate;
