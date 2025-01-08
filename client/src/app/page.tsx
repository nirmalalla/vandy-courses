'use client'

import Searchbar from "./Components/Searchbar";
import { Layout, Button } from "antd";
import { Header } from "antd/es/layout/layout";
import { Content } from "antd/es/layout/layout";
import { Footer } from "antd/es/layout/layout";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const onClick = () => {
    router.push(`/post`);
  }
  
  return (
    <>
      <Layout>
        <Header style={{ display: "flex", minHeight: "15vh", backgroundColor: "white", alignItems: "center"}}>
          <h1 style={{padding: 4}}>vandycourses</h1>
          <Button onClick={onClick} variant="text" color="default">Post</Button>
        </Header>
        <Content style={{ padding: '0 48px', alignItems: "center", minHeight: "75vh", backgroundColor: "white", display: "flex", justifyContent: "center"}}>
          <Searchbar />
        </Content>
        <Footer style={{ textAlign: "center", backgroundColor: "black"}}>
          <p style={{color: "white"}}>made by nirmal</p>
        </Footer>
      </Layout>
    </>
  )
}
