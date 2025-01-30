'use client'

import Searchbar from "./Components/Searchbar";
import { Layout, Flex } from "antd";
import { Content } from "antd/es/layout/layout";
import { Footer } from "antd/es/layout/layout";
import Navbar from "./Components/Navbar";

import TextLoop from "react-text-loop";

export default function Home() {
  
  return (
    <>
      <Layout>
        <Navbar />
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
