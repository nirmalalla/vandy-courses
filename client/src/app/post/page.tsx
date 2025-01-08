'use client'

import { Layout, Button } from "antd";
import { Header, Content, Footer } from "antd/es/layout/layout";
import type { FormProps } from 'antd';
import { Checkbox, Form, Input, Select } from 'antd';

export default function PostForm(){
   
    return (
        <>
            <Layout>
                <Header style={{ display: "flex", minHeight: "15vh", backgroundColor: "white", alignItems: "center"}}>
                    <h1 style={{padding: 4}}>vandycourses</h1>
                    <Button variant="text" color="default">Post</Button>
                </Header>
                <Content style={{ padding: '0 48px', alignItems: "center", minHeight: "75vh", backgroundColor: "white", display: "flex", justifyContent: "center"}}>
                    <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        initialValues={{ remember: true }}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Course"
                            rules={[{ required: true, message: 'Please Input your Course' }]}
                        >
                            <Input placeholder="e.g. CS2201" />
                        </Form.Item>

                        <Form.Item
                            label="Professor"
                            rules={[{required: true, message: "Please Input your Professor"}]}
                        >
                            <Input placeholder="e.g. John Doe"/>
                        </Form.Item>

                        <Form.Item
                            label="Grade"
                            rules={[{required: true, message: "Please Input your Grade"}]}
                        >
                            <Select 
                                defaultValue="A+"
                                style={{ width: 120 }}
                                options={[
                                    {value: 'A+', label: 'A+'},
                                    { value: 'A', label: 'A' },
                                    { value: 'A-', label: 'A-' },
                                    { value: 'B+', label: 'B+' },
                                    { value: 'B', label: 'B'},
                                    {value: 'B-', label: 'B-'},
                                    {value: 'C+', label: 'C+'},
                                    {value: 'C', label: 'C'},
                                    {value: 'C-', label: 'C-'},
                                    {value: 'D+', label: 'D+'},
                                    {value: 'D', label: 'D'},
                                    {value: 'D-', label: 'D-'},
                                    {value: 'F', label: 'F'}
                                ]}
                            />
                        </Form.Item>

                        <Form.Item style={{display: "flex", justifyContent: "center"}}>
                            <Button type="primary">Submit</Button>
                        </Form.Item>

                    </Form>
                </Content>
                <Footer style={{ textAlign: "center", backgroundColor: "black"}}>
                    <p style={{color: "white"}}>made by nirmal</p>
                </Footer>
            </Layout>
        </>
    )
}