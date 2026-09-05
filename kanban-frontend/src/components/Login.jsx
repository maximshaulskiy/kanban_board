import React, { useState } from "react";
import { Link } from "react-router-dom"
import api from "../api"
import "./Login.css"


const Login = ({ onLoginSuccess }) => {
    const [Email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await api.post("/auth/jwt/create/", {
                email: Email,
                password: password,
            });

            const access_token = response.data.access
            const refresh_token = response.data.refresh

            localStorage.setItem("access_token", access_token)
            localStorage.setItem("refresh_token", refresh_token)

            onLoginSuccess(access_token, refresh_token)
        } catch(error) {
            setError("Неверная почта или пароль или почта не потверждена");
            console.log(error)
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Вход</h2>
                {error && <p className="login-error">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                 />
                 <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                 />
                 <button type="submit">Войти</button>

                 <p className="auth-footer">
                    Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                 </p>
            </form>
        </div>
    )
};


export default Login;