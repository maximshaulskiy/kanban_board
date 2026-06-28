import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api"
import "./Login.css"


const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (username.length < 3 || username.length > 20) {
            setError("Имя пользователя должно быть от 3 до 20 символов");
            return;
        }

        if (password.length < 8) {
            setError("Пароль должен быть не менее 8 символов");
            return;
        }

        if (password !== confirmPassword) {
            setError("Пароли не совпадают")
            return;
        }

        try {
            await api.post("/auth/users/", {
                username: username,
                email: email,
                password: password,
                password_confirm: confirmPassword,
            });

            navigate("/login")
            
        } catch (error) {
            if (error.response && error.response.data) {
                const serverErrors = error.response.data

                if (typeof serverErrors === 'object') {
                    const messages = Object.entries(serverErrors).map(([key, value]) =>{
                        return `${key}: ${Array.isArray(value) ? value.join(", ") : value}`
                    });
                    setError(messages.join("\n"))
                } else {
                    setError("Произошла ошибка на сервере")
                }
            } else {
                setError("Не удалось связаться с сервером")
            }
            console.log(error)
        }

    }

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleRegister}>
                <h2>Регистрация</h2>
                {error && <p className="login-error">{error}</p>}
                <input
                    type="text"
                    placeholder="Имя пользователя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
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
                <input
                    type="password"
                    placeholder="Подтвердите пароль"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit">Создать аккаунт</button>
                
                <p className="auth-footer">
                    Уже есть аккаунт? <Link to="/login">Войти</Link>
                </p>
            </form>
        </div>
    );


    }



export default Register;