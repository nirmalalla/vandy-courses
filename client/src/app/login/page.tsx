'use client'

import { Layout, Flex, Button } from "antd";
import { Content, Footer } from "antd/es/layout/layout";
import Link from "next/link";
import Navbar from "../Components/Navbar";

export default function LoginPage(){
    const handleLogin = async () => {
        try {
            // Directly redirect to the backend route
            window.location.href = 'https://vandy-courses-backend.onrender.com/api/users/auth/google';
        } catch (error) {
            console.error('Error during authentication:', error);
        }
    }

    return (
        <>
            <Layout>
                <Navbar />   
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