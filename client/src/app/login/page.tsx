'use client'

import { Layout, Button } from "antd";
import { Header, Content, Footer } from "antd/es/layout/layout";
import { Form, Input } from 'antd';
import { useRouter } from "next/navigation";

export default function LoginPage(){
    const router = useRouter();
    
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

    return (
        <>
            <Layout>
                <Header style={{ display: "flex", minHeight: "15vh", backgroundColor: "white", alignItems: "center"}}>
                    <h1 style={{padding: 4}}>VandyCourses</h1>
                    <Button style={{ marginTop: 6}} onClick={onClick} variant="text" color="default">Post</Button>
                </Header>
                <Content style={{ padding: '0 48px', alignItems: "center", minHeight: "75vh", backgroundColor: "white", display: "flex", justifyContent: "center"}}>
                    <Button type="primary" onClick={handleLogin}>Login with Google</Button>
                </Content>
                <Footer style={{ textAlign: "center", backgroundColor: "black"}}>
                    <p style={{color: "white"}}>made by nirmal</p>
                </Footer>
            </Layout>
        </>
    )
}