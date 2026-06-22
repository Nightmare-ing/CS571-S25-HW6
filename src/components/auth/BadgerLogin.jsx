import React, { useContext, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router";
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

export default function BadgerLogin() {
    // TODO Create the login component.
    const usernameRef = useRef();
    const passwdRef = useRef();
    const [_, setLoginStatus] = useContext(BadgerLoginStatusContext);

    const navigate = useNavigate();

    function validateLoginInfo() {
        if (
            usernameRef.current.value === "" ||
            passwdRef.current.value === ""
        ) {
            alert("You must provide both a username and pin!");
            return false;
        }
        if (!/^\d{7}$/.test(passwdRef.current.value)) {
            alert("Your pin is a 7-digit number!");
            return false;
        }
        return true;
    }

    function handleLogin(e) {
        e?.preventDefault();
        if (validateLoginInfo()) {
            fetch("https://cs571.org/rest/s25/hw6/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "X-CS571-ID": CS571.getBadgerId(),
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    username: usernameRef.current.value,
                    pin: passwdRef.current.value,
                }),
            }).then((res) => {
                if (res.status === 401) {
                    alert("Incorrect username or pin!");
                } else if (res.status === 200) {
                    alert("Login successfully!");
                    sessionStorage.setItem("isLoggedIn", "true");
                    setLoginStatus(true);
                    navigate("/");
                }
            });
        }
    }

    return (
        <>
            <h1>Login</h1>
            <Form onSubmit={handleLogin}>
                <Form.Label htmlFor="username">Username</Form.Label>
                <Form.Control id="username" ref={usernameRef} />
                <br />
                <Form.Label htmlFor="passwd">Password</Form.Label>
                <Form.Control id="passwd" ref={passwdRef} type="password" />
                <br />
                <Button type="submit">Login</Button>
            </Form>
        </>
    );
}
