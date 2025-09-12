import Login from "./login";
import Register from "./Register";
import { useState } from "react";

function Welcome({setUser}) {
    const [page, setPage] = useState("login");
    
    const handleSubmit = (formData, type) => {
        if (type === "login") {
            console.log("Login Data:", formData);
        } else if (type === "register") {
            console.log("Register Data:", formData);
        }
        setUser(true);
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