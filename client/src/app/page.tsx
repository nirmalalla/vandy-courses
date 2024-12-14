import Searchbar from "./Components/Searchbar";
import { Layout } from "antd";
import { Header } from "antd/es/layout/layout";
import { Content } from "antd/es/layout/layout";
import { Footer } from "antd/es/layout/layout";


export default function Home() {
  return (
    <>
      <Layout>
        <Header style={{ display: "flex", alignItems: "center"}}>
        </Header>
        <Content style={{ padding: '0 48px'}}>
          <Searchbar />
        </Content>
        <Footer style={{ textAlign: "center"}}>made by nirmal</Footer>
      </Layout>
    </>
  )
}
