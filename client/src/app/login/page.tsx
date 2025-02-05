'use client'

import { Layout, Flex, Button, Row, Space, Dropdown, Col, MenuProps } from "antd";
import { Header, Content, Footer } from "antd/es/layout/layout";
import { useRouter } from "next/navigation";
import { UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function LoginPage(){
    const router = useRouter();
    const [signedIn, setSignedIn] = useState(false);
    
    const items: MenuProps["items"] = [
        {
        label: (
            <Link href="/login" style={{ color: "black" }} >Switch Account</Link>
        ),
        key: 'O'
        }
    ]
    const onClick = () => {
        router.push(`/post`);
    }

    const handleLogin = async () => {
        try {
            // Directly redirect to the backend route
            window.location.href = 'http://localhost:5000/api/users/auth/google';
        } catch (error) {
            console.error('Error during authentication:', error);
        }
    }

    const checkToken = async () => {
        try {

        const res = await fetch("http://localhost:5000/api/users/auth/checkCookie", {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
            credentials: 'include',
        });

        if (res.ok){
            setSignedIn(true);
        }else{
            setSignedIn(false);
        }
        } catch (error){
        console.error("error: ", error);
        }
    }

    const onLogin = () => {
        router.push("/login");
    }

    useEffect(() => {
        checkToken();
    }, []);

    return (
        <>
            <Layout>
                <Header style={{ backgroundColor: 'white' }}>
                    <Row justify="space-between" align="middle">
                    <Space>
                        <Link href="/" style={{ color: "black" }}><h1>VandyCourses</h1></Link>
                        <Button onClick={onClick} type="text" style={{marginTop: "3vh"}}>Post</Button>
                    </Space>
                    
                    <Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {signedIn ?
                        <Dropdown menu={{items}} trigger={["click"]}>
                            <Space>
                            <Button type="text" style={{ marginTop: "3vh"}} >
                                <UserOutlined style={{ fontSize: '20px' }} />  
                            </Button>
                            </Space>
                        </Dropdown> :
                        <Button onClick={onLogin} type="text">Login</Button>
                        }
                    </Col>
                    </Row>
                </Header>
                <Content style={{ padding: '0 48px', alignItems: "center", minHeight: "77vh", backgroundColor: "white", display: "flex", justifyContent: "center"}}>
                    <Button type="primary" onClick={handleLogin}>Login with Google</Button>
                </Content>
                <Footer style={{ textAlign: "center", backgroundColor: "black", minHeight: "1vh"}}>
                    <Flex style={{justifyContent: "center"}}>
                        <Link href="https://github.com/nirmalalla/vandy-courses/blob/main/README.md#privacy-info"><p style={{color: "white", marginRight: "2vw", textDecoration: "underline"}}>Privacy Info</p></Link>
                        <Link href="https://github.com/nirmalalla/vandy-courses"><p style={{color: "white", marginLeft: "2vw", textDecoration: "underline"}}>Source Code</p></Link>
                    </Flex>
                </Footer>
            </Layout>
        </>
    )
}