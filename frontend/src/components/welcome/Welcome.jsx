// frontend/src/components/welcome/Welcome.jsx

import Login from "./login";
import Register from "./Register";
import { useState } from "react";

function Welcome({setUser}) {
    const [page, setPage] = useState("login");

    const handleSubmit = async (formData, type) => {
        const url = `http://localhost:5000/api/auth/${type}`; // 'login' or 'register'

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                console.log(`${type} successful:`, data);
                // Store the token in the browser's local storage
                localStorage.setItem('token', data.token);
                // Update the user state to log them in
                setUser(true);
            } else {
                console.error(`${type} failed:`, data.msg);
                // Show an error message to the user
                alert(data.msg);
            }
        } catch (error) {
            console.error('An error occurred:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    return (
        <>
            {(page === "login") ?
                <Login setPage={setPage} onSubmit={handleSubmit} /> :
                <Register setPage={setPage} onSubmit={handleSubmit} />}
        </>
    )
}
export default Welcome;