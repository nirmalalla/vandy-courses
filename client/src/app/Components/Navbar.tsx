'use client'

import { Header } from "antd/es/layout/layout";
import { Row, Space, Button, Col, Dropdown } from "antd";
import Link from "next/link";
import { UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { MenuProps } from "antd";
import { useState, useEffect } from "react";

export default function Navbar() {
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
    
    const onLogin = () => {
        router.push("/login");
    }

    const checkToken = async () => {
        try {

        const res = await fetch("https://vandy-courses-backend.onrender.com/api/users/auth/checkCookie", {
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

    useEffect(() => {
        checkToken();
    })
  

    return (
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
    )
}