import React, { useRef } from "react";
import { Button, Form } from "react-bootstrap";

export default function BadgerRegister() {
    // TODO Create the register component.
    const usernameRef = useRef();
    const passwdRef = useRef();
    const repeatPasswdRef = useRef();

    function validatePasswd() {
        const username = usernameRef.current.value;
        const passwd = passwdRef.current.value;
        const repeatPasswd = repeatPasswdRef.current.value;

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
                    username: usernameRef.current.value,
                    pin: passwdRef.current.value,
                }),
            }).then((res) => {
                if (res.status === 200) {
                    alert("You registered successfully!");
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
                <Form.Control id="username" ref={usernameRef}></Form.Control>
                <br />
                <Form.Label htmlFor="passwd">Password</Form.Label>
                <Form.Control
                    id="passwd"
                    ref={passwdRef}
                    type="password"
                ></Form.Control>
                <br />
                <Form.Label htmlFor="repeatPasswd">Repeat Password</Form.Label>
                <Form.Control
                    id="repeatPasswd"
                    ref={repeatPasswdRef}
                    type="password"
                ></Form.Control>
                <br />
                <Button type="submit">Register</Button>
            </Form>
        </>
    );
}
