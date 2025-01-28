'use client'

import { useState} from "react";
import { Layout, Button, Space } from "antd";
import { Header, Content, Footer } from "antd/es/layout/layout";
import { Form, Input, Select } from 'antd';
import { useRouter } from "next/navigation";

export default function PostForm(){
    const [course, setCourse] = useState("");
    const [prof, setProf] = useState("");
    const [grade, setGrade] = useState("A+");
    const router = useRouter();

    const onClick = () => {
        router.push(`/post`);
    }

    const onSubmit = async () => {
        try {

            const res = await fetch('http://localhost:5000/api/grades', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // Include credentials to ensure cookies are sent
                credentials: 'include',
                body: JSON.stringify({ course, gradeReceived: grade, prof })
            });

            const statusCode = res.status;

            if (!res.ok) {
                if (statusCode === 401 || statusCode === 403) {
                    router.push("/login");
                } else {
                    console.log("Invalid info");
                }
            } else {
                console.log("Grade created");
                router.push('/');
            }
        } catch (error) {
            console.error("Error: ", error);
        }
    };

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
                    <h1 style={{padding: 4}}>VandyCourses</h1>
                    <Button style={{ marginTop: 6}} onClick={onClick} variant="text" color="default">Post</Button>
                </Header>
                <Content style={{ padding: '0 48px', alignItems: "center", minHeight: "75vh", backgroundColor: "white", display: "flex", justifyContent: "center"}}>
                    <Space direction="vertical" size="large">
                        <h1>Post a Grade</h1>
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
                                <Button type="primary" onClick={onSubmit}>Submit</Button>
                            </Form.Item>

                        </Form>

                    </Space>
                </Content>
                <Footer style={{ textAlign: "center", backgroundColor: "black"}}>
                    <p style={{color: "white"}}>made by nirmal</p>
                </Footer>
            </Layout>
        </>
    )
}