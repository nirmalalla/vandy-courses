'use client'

import { useEffect, useState} from "react";
import { Layout, Button, Space, AutoComplete } from "antd";
import { Header, Content, Footer } from "antd/es/layout/layout";
import { Form, Input, Select } from 'antd';
import { useRouter } from "next/navigation";
import { CourseName, Option } from "../Components/Searchbar";

export default function PostForm(){
    const [prof, setProf] = useState("");
    const [grade, setGrade] = useState("A+");
    const [allOptions, setAllOptions] = useState<Option[]>([]);
    const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
    const [chosen, setChosen] = useState("");
    const router = useRouter();

    const onClick = () => {
        router.push(`/post`);
    }

    const getCourses = async () => {
        const res = await fetch("http://localhost:5000/api/grades/course", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();
        const courses = data.map((item: CourseName) => ({
            value: item.course,
        }));
        
        setAllOptions(courses);
        setFilteredOptions(courses);
    }

    const getPanelValue = (searchText: string) => {
        if (!searchText) return allOptions;

        return allOptions.filter((option: Option) => 
            option?.value?.toLowerCase().includes(searchText.toLowerCase())
        );
    }

    const onChange = (data: string) => {
        setChosen(data);
    }

    const onSearch = (text: string) => {
        const filtered = getPanelValue(text);
        setFilteredOptions(filtered);
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
                body: JSON.stringify({ course: chosen, gradeReceived: grade, prof: prof })
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

    const handleProfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProf(event.target.value);
    }

    const handleGradeChange = (value: string) => {
        setGrade(value);
    }

    useEffect(() => {
        getCourses();
    }, [])


    return (
        <>
            <Layout>
                <Header style={{ display: "flex", minHeight: "15vh", backgroundColor: "white", alignItems: "center"}}>
                    <a href="/" style={{color: "black"}}>
                        <h1 style={{padding: 4}}>VandyCourses</h1>
                    </a>
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
                            >
                                <AutoComplete
                                    value={chosen}
                                    options={filteredOptions}
                                    style={{
                                        width: 200, 
                                        height: 30, 
                                        fontSize: "16px",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                    onChange={onChange}
                                    onSearch={onSearch}
                                    placeholder="Course Name"
                                />
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