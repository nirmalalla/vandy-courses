'use client'

import Searchbar from "./Components/Searchbar";
import { useState, useEffect } from "react";
import { Layout, Button, Flex, Row, Space, Col } from "antd";
import { Header } from "antd/es/layout/layout";
import { Content } from "antd/es/layout/layout";
import { Footer } from "antd/es/layout/layout";
import { useRouter } from "next/navigation";
import { UserOutlined } from "@ant-design/icons";
import { Dropdown } from "antd"
import { MenuProps } from "antd";
import Link from "next/link";

import TextLoop from "react-text-loop";

export default function Home() {
  const [signedIn, setSignedIn] = useState(false);
  const router = useRouter();

  const items: MenuProps["items"] = [
    {
      label: (
        <Link href="/login" style={{ color: "black" }} >Switch Account</Link>
      ),
      key: 'O'
    }
  ]

  const checkToken = async () => {
    try {

      const res = await fetch("http://127.0.0.1:5000/api/users/auth/checkCookie", {
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
  

  const onClick = () => {
    router.push(`/post`);
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
          <Flex gap="middle" vertical>
            <TextLoop interval={1500}>
              <h1>Fully Anonymous.</h1>
              <h1>Real Courses.</h1>
              <h1>Real Professors.</h1>
            </TextLoop>
            <Flex>
              <Searchbar />
            </Flex>
          </Flex>
        </Content>
        <Footer style={{ textAlign: "center", backgroundColor: "black", minHeight: "1vh"}}>
          <Flex style={{justifyContent: "center"}}>
            <p style={{color: "white", marginRight: "2vw"}}>Privacy Info</p>
            <p style={{color: "white", marginLeft: "2vw"}}>Source Code</p>
          </Flex>
        </Footer>
      </Layout>
    </>
  )
}
