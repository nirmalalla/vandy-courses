'use client'

import { useState} from "react";
import { Layout, Button } from "antd";
import { Header, Content, Footer } from "antd/es/layout/layout";
import type { FormProps } from 'antd';
import { Checkbox, Form, Input, Select } from 'antd';
import { useRouter } from "next/navigation";

export default function PostForm(){
    const [course, setCourse] = useState("");
    const [prof, setProf] = useState("");
    const [grade, setGrade] = useState("A+");
    const router = useRouter();

    const onClick = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/grades', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ course, gradeReceived: grade, prof })
            });
            
            const statusCode = res.status;

            if (!res.ok){
                if (statusCode === 401 || statusCode === 403){
                    router.push("/login");
                }else{
                    console.log("invalid info");
                }
            }else{
                console.log("grade created");
                router.push('/');
            }
        } catch (error) {
            console.error("error: ", error);
        }
    }

    const handleCourseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCourse(event.target.value);
    }

    const handleProfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProf(event.target.value);
    }

    const handleGradeChange = (value: string) => {
        setGrade(value);
    }


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
                            <Input value={course} onChange={handleCourseChange} placeholder="e.g. CS2201" />
                        </Form.Item>

                        <Form.Item
                            label="Professor"
                            rules={[{required: true, message: "Please Input your Professor"}]}
                        >
                            <Input value={prof} onChange={handleProfChange} placeholder="e.g. John Doe"/>
                        </Form.Item>

                        <Form.Item
                            label="Grade"
                            rules={[{required: true, message: "Please Input your Grade"}]}
                        >
                            <Select 
                                onChange={handleGradeChange}
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
                            <Button type="primary" onClick={onClick}>Submit</Button>
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