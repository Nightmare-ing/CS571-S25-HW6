import React, { useContext, useEffect, useRef, useState } from "react";
import BadgerMessage from "./BadgerMessage";
import { Container, Row, Col, Pagination, Form, Button } from "react-bootstrap";
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

export default function BadgerChatroom(props) {
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(1);
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);
    const postTitleRef = useRef();
    const postContentRef = useRef();

    const loadMessages = () => {
        fetch(
            `https://cs571.org/rest/s25/hw6/messages?chatroom=${props.name}&page=${page}`,
            {
                headers: {
                    "X-CS571-ID": CS571.getBadgerId(),
                },
            },
        )
            .then((res) => res.json())
            .then((json) => {
                setMessages(json.messages);
            });
    };

    function handlePost(e) {
        e?.preventDefault();
        if (
            postTitleRef.current.value === "" ||
            postContentRef.current.value === ""
        ) {
            alert("You must provide both a title and content!");
            return;
        }

        fetch(
            `https://cs571.org/rest/s25/hw6/messages?chatroom=${props.name}`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "X-CS571-ID": CS571.getBadgerId(),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: postTitleRef.current.value,
                    content: postContentRef.current.value,
                }),
            },
        ).then((res) => {
            if (res.status === 200) {
                alert("Successfully posted!");
                postTitleRef.current.value = "";
                postContentRef.current.value = "";
                loadMessages();
            }
        });
    }

    function deletePost(postId) {
        fetch(`https://cs571.org/rest/s25/hw6/messages?id=${postId}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
            },
        }).then((res) => {
            if (res.status === 200) {
                alert("Successfully deleted the post!");
                loadMessages();
            }
        });
    }

    // Why can't we just say []?
    // The BadgerChatroom doesn't unload/reload when switching
    // chatrooms, only its props change! Try it yourself.
    useEffect(loadMessages, [props, page]);

    return (
        <>
            <h1>{props.name} Chatroom</h1>
            {/* TODO: Allow an authenticated user to create a post. */}
            <hr />
            {messages.length > 0 ? (
                <Container>
                    <Row>
                        <Col xs={12} md={6} lg={4}>
                            {loginStatus.isLoggedIn ? (
                                <Form onSubmit={handlePost}>
                                    <Form.Label htmlFor="post-title">
                                        Post Title
                                    </Form.Label>
                                    <Form.Control
                                        id="post-title"
                                        ref={postTitleRef}
                                    />
                                    <br />
                                    <Form.Label htmlFor="post-content">
                                        Post Content
                                    </Form.Label>
                                    <Form.Control
                                        id="post-content"
                                        ref={postContentRef}
                                    />
                                    <br />
                                    <Button type="submit">Create Post</Button>
                                </Form>
                            ) : (
                                <p>You must be logged in to post!</p>
                            )}
                        </Col>
                        <Col>
                            <Container>
                                <Row>
                                    {messages.map((msg) => (
                                        <Col xs={12} md={6} lg={3} key={msg.id}>
                                            <BadgerMessage
                                                id={msg.id}
                                                title={msg.title}
                                                poster={msg.poster}
                                                content={msg.content}
                                                created={msg.created}
                                                deletePost={deletePost}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </Container>
                        </Col>
                    </Row>
                </Container>
            ) : (
                <>
                    <p>There are no messages on this page yet!</p>
                </>
            )}
            <Pagination>
                {Array.from({ length: 4 }, (_, i) => i + 1).map((pageNum) => (
                    <Pagination.Item
                        active={pageNum === page}
                        key={pageNum}
                        onClick={() => {
                            setPage(pageNum);
                        }}
                    >
                        {pageNum}
                    </Pagination.Item>
                ))}
            </Pagination>
        </>
    );
}
