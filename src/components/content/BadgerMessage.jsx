import React, { useContext } from "react";
import { Button, Card } from "react-bootstrap";
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

function BadgerMessage(props) {
    const dt = new Date(props.created);
    const [loginStatus, _] = useContext(BadgerLoginStatusContext);

    return (
        <Card style={{ margin: "0.5rem", padding: "0.5rem" }}>
            <h2>{props.title}</h2>
            <sub style={{ lineHeight: "normal" }}>
                Posted on {dt.toLocaleDateString()} at {dt.toLocaleTimeString()}
            </sub>
            <br />
            <i>{props.poster}</i>
            <p>{props.content}</p>
            {props.poster === loginStatus.username && (
                <Button
                    variant="danger"
                    onClick={() => {
                        props.deletePost(props.id);
                    }}
                >
                    Delete Post
                </Button>
            )}
        </Card>
    );
}

export default BadgerMessage;
