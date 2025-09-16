// frontend/src/components/welcome/Welcome.jsx

import Login from "./Login";
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
                // Here you would typically save the token (data.token) to local storage
                // and then update the user state.
                setUser(true);
            } else {
                console.error(`${type} failed:`, data.msg);
                // You could display an error message to the user here
            }
        } catch (error) {
            console.error('An error occurred:', error);
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