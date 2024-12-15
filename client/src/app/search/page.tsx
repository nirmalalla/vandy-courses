'use client'

import { Layout, Button } from "antd";
import { Header, Content, Footer } from "antd/es/layout/layout";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function CourseDisplay(){
    const getGrades = async () => {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('query');
        const res = await fetch(`http://localhost:5000/api/grades/course/${query}`)
        const data = await res.json()
        console.log(data);
    }

    useEffect(() => {
        getGrades();
    }, [])
    
    return (
        <>
            <Layout>
                <Header style={{ display: "flex", minHeight: "15vh", backgroundColor: "white", alignItems: "center"}}>
                    <h1 style={{padding: 4}}>vandycourses</h1>
                    <Button variant="text" color="default">Post</Button>
                </Header>
                <Content style={{ padding: '0 48px', alignItems: "center", minHeight: "75vh", backgroundColor: "white", display: "flex", justifyContent: "center"}}>
                </Content>
                <Footer style={{ textAlign: "center", backgroundColor: "black"}}>
                    <p style={{color: "white"}}>made by nirmal</p>
                </Footer>
            </Layout>
        </>
    )
}