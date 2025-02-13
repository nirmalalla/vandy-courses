'use client'

import Searchbar from "./Components/Searchbar";
import { Layout, Flex } from "antd";
import { Content } from "antd/es/layout/layout";
import { Footer } from "antd/es/layout/layout";
import Navbar from "./Components/Navbar";
import Link from "next/link";
import TextLoop from "./Components/TextLoop";

export default function Home() {
  
  return (
    <>
      <Layout>
        <Navbar />
        <Content style={{ padding: '0 48px', alignItems: "center", minHeight: "77vh", backgroundColor: "white", display: "flex", justifyContent: "center"}}>
          <Flex gap="middle" vertical>
            <TextLoop texts={["Real Courses", "Real Grades", "Real Professors"]} interval={1500} />
            <Flex>
              <Searchbar />
            </Flex>
          </Flex>
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
