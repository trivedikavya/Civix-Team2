import Login from "./login";
import Register from "./Register";
import { useState } from "react";

function Welcome() {
    const [page, setPage] = useState("login");
    return (
        <>
            {(page == "login") ?
                <Login setPage={setPage} /> :
                <Register setPage={setPage} />}
        </>
    )
}
export default Welcome;