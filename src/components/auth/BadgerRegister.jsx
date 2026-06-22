import React, { useRef, useState, useContext } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router";
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

export default function BadgerRegister() {
    // TODO Create the register component.
    const [username, setUsername] = useState("");
    const [passwd, setPasswd] = useState("");
    const [repeatPasswd, setRepeatPasswd] = useState("");

    const navigate = useNavigate();
    const [_, setLoginStatus] = useContext(BadgerLoginStatusContext);

    function validatePasswd() {
        if (username === "" || passwd === "") {
            alert("You must provide both a username and a pin!");
            return false;
        }

        if (passwd !== repeatPasswd) {
            alert("Your pins do not match!");
            return false;
        }

        if (!/^\d{7}$/.test(passwd)) {
            alert("Your pin must be a 7-digit number!");
            return false;
        }

        return true;
    }

    function checkAndSubmit(e) {
        e?.preventDefault();

        if (validatePasswd()) {
            fetch("https://cs571.org/rest/s25/hw6/register", {
                method: "POST",
                credentials: "include",
                headers: {
                    "X-CS571-ID": CS571.getBadgerId(),
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    pin: passwd,
                }),
            }).then((res) => {
                if (res.status === 200) {
                    alert("You registered successfully!");
                    sessionStorage.setItem("isLoggedIn", "true");
                    setLoginStatus(true);
                    navigate("/");
                } else if (res.status === 409) {
                    alert("That username has already been taken!");
                }
            });
        }
    }

    return (
        <>
            <h1>Register</h1>
            <Form onSubmit={checkAndSubmit}>
                <Form.Label htmlFor="username">Username</Form.Label>
                <Form.Control
                    id="username"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}
                ></Form.Control>
                <br />
                <Form.Label htmlFor="passwd">Password</Form.Label>
                <Form.Control
                    id="passwd"
                    value={passwd}
                    type="password"
                    onChange={(e) => {
                        setPasswd(e.target.value);
                    }}
                ></Form.Control>
                <br />
                <Form.Label htmlFor="repeatPasswd">Repeat Password</Form.Label>
                <Form.Control
                    id="repeatPasswd"
                    type="password"
                    value={repeatPasswd}
                    onChange={(e) => {
                        setRepeatPasswd(e.target.value);
                    }}
                ></Form.Control>
                <br />
                <Button type="submit">Register</Button>
            </Form>
        </>
    );
}
