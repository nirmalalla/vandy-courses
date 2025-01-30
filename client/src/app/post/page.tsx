'use client'

import { useEffect, useState} from "react";
import { Layout, Button, Space, AutoComplete, Flex, Input } from "antd";
import { Content, Footer } from "antd/es/layout/layout";
import { Form, Select, notification } from 'antd';
import { useRouter } from "next/navigation";
import { CourseName, Option } from "../Components/Searchbar";
import Navbar from "../Components/Navbar";
import Link from "next/link";

interface Professor{
    value?: string;
}

export default function PostForm(){
    const [prof, setProf] = useState("");
    const [availProfs, setAvailProfs] = useState<Option[]>([]);
    const [filteredProfs, setFilteredProfs] = useState<Option[]>([]);
    const [grade, setGrade] = useState("A+");
    const [allOptions, setAllOptions] = useState<Option[]>([]);
    const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
    const [chosen, setChosen] = useState("");
    const [term, setTerm] = useState("");
    const [api, contextHolder] = notification.useNotification();
    const router = useRouter();

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

    const getProfs = async (courseId: string) => {
        const res = await fetch(`http://localhost:5000/api/grades/profs/${courseId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });

        const data = await res.json();
        const profs: Professor[] = [];

        for (let i = 0; i < data.professors.length; i++){
            profs.push({value: data.professors[i]});
        }

        setAvailProfs(profs);
        setFilteredProfs(profs);
    }

    const getPanelValue = (searchText: string) => {
        if (!searchText) return allOptions;

        return allOptions.filter((option: Option) => 
            option?.value?.toLowerCase().includes(searchText.toLowerCase())
        );
    }
    
    const getProfPanelValue = (searchText: string) => {
        if (!searchText) return availProfs;

        return availProfs.filter((option: Option) => 
            option?.value?.toLowerCase().includes(searchText.toLowerCase())
        );
    }

    const onChange = (data: string) => {
        setChosen(data);
        getProfs(data);
    }

    const onProfChange = (data: string) => {
        setProf(data);
    }

    const onSearch = (text: string) => {
        const filtered = getPanelValue(text);
        setFilteredOptions(filtered);
    }

    const onProfSearch = (text: string) => {
        const filtered = getProfPanelValue(text);
        setFilteredProfs(filtered);
    }


    const openNotification = () => {
        api["error"]({
            message: "Must use a Vanderbilt Email",
            description: "Please Login Again",
            placement: "bottomRight"
        })
    }

    const invalidInfoNotif = () => {
        api["error"]({
            message: "Invalid Info",
            description: "Please fill out all data fields correctly",
            placement: "bottomRight"
        })
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
                body: JSON.stringify({ course: chosen, gradeReceived: grade, prof: prof, term: term })
            });

            const statusCode = res.status;

            if (!res.ok) {
                const errorData = await res.json();
                if (errorData.error === "non vanderbilt"){
                    openNotification();
                }else if (statusCode === 401 || statusCode === 403) {
                    router.push("/login");
                } else {
                    invalidInfoNotif();
                }
            } else {
                console.log("Grade created");
                router.push('/');
            }
        } catch (error) {
            console.error("Error: ", error);
        }
    };

    const handleGradeChange = (value: string) => {
        setGrade(value);
    }
    
    const handleTermChange = (value: string) => {
        setTerm(value);
    }

    useEffect(() => {
        getCourses();
    }, [])


    return (
        <>
            <Layout>
                {contextHolder}
                <Navbar />
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
                                    placeholder="e.g. CS-2201"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Professor"
                                rules={[{required: true, message: "Please Input your Professor"}]}
                            >
                                <AutoComplete
                                    value={prof}
                                    options={filteredProfs}
                                    style={{
                                        width: 200, 
                                        height: 30, 
                                        fontSize: "16px",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                    onChange={onProfChange}
                                    onSearch={onProfSearch}
                                    placeholder="e.g. John Doe"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Term"
                                rules={[{required: true}]}
                            >
                                <Input value={term} onChange={(e) => handleTermChange(e.target.value)} placeholder="e.g. 25S"/>
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