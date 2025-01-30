'use client'

import { Layout, Button, Select, Flex, Col, Row, Space } from "antd";
import { Header, Content, Footer } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import CustomBarChart from "../Components/CustomBarChart";


interface DataPoint{
    grade: string;
    frequency: number;
}

interface Grade{
    id?: number;
    userId: number;
    course: string;
    gradeReceived: string;
    prof: string;
    term: string;
    createdAt?: Date;
    updatedAt?: Date;
}
import { useRouter } from "next/navigation";
import { UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Dropdown, MenuProps } from "antd";

export default function CourseDisplay(){
    const [gradeData, setGradeData] = useState<DataPoint[]>([]);
    const [rawData, setRawData] = useState<Grade[]>([]);
    const [cProf, setCProf] = useState<string>("");
    const [cTerm, setCTerm] = useState<string>("");
    const [filtered, setFiltered] = useState<DataPoint[]>([]);
    const [profs, setProfs] = useState<string[]>([]);
    const [terms, setTerms] = useState<string[]>([]);
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
    const getGrades = async () => {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('query');
        const res = await fetch(`http://localhost:5000/api/grades/course/${query}`);
        const data: Grade[] = await res.json();
        setRawData(data);

        const tmpProfs: string[] = [];
        const tmpTerms: string[] = [];

        for (let i = 0; i < data.length; i++){
            if (tmpProfs.indexOf(data[i].prof) === -1){
                tmpProfs.push(data[i].prof);
            }
            if (tmpTerms.indexOf(data[i].term) === -1){
                tmpTerms.push(data[i].term);
            }
        }


        setProfs(tmpProfs);
        setTerms(tmpTerms);
        setGradeData(getFrequencies(data));
    }

    const getFrequencies = (grades: Grade[]) => {
        const frequencyMap: Map<string, number> = new Map();

        for (let i = 0; i < grades.length; i++){
            const grade = grades[i].gradeReceived;
            if (frequencyMap.has(grade)){
                const curVal: number = frequencyMap.get(grade)!;
                frequencyMap.set(grade, curVal + 1);
            }else{
                frequencyMap.set(grade, 1);
            }
        }
        
        const frequencyArray: {grade: string, frequency: number}[] = [];
        
        frequencyMap.forEach((value, key) => {
            frequencyArray.push({grade:key, frequency:value});
        })

        return frequencyArray;
    }

    const chooseProf = (prof: string) => {
        if (prof === "all professors"){
            setCProf("");

            if (!cTerm){
                setFiltered([]);
            }else{
                const tmp = rawData.filter((grade) => grade.term === cTerm)
                setFiltered(getFrequencies(tmp));
            }

        }else{
            let tmp = [];
            setCProf(prof);
            if (!cTerm){
                tmp = rawData.filter((grade) => grade.prof === prof);
            }else{
                tmp = rawData.filter((grade) => grade.prof === prof && grade.term === cTerm); 
            }

            setFiltered(getFrequencies(tmp));
        }
    }

    const chooseTerm = (term: string) => {
        if (term === "all terms"){
            setCTerm("");

            if (!cProf){
                setFiltered([]);
            }else{
                const tmp = rawData.filter((grade) => grade.prof === cProf)
                setFiltered(getFrequencies(tmp));
            }
        }else{
            let tmp = [];
            setCTerm(term);
            if (!cProf){
                tmp = rawData.filter((grade) => grade.term === term);
            }else{
                tmp = rawData.filter((grade) => grade.term === term && grade.prof === cProf);
            }

            setFiltered(getFrequencies(tmp));
        }
    }

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
        getGrades();
        checkToken();
    }, [])
    
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
                <Content style={{ padding: '0 48px', alignItems: "center", minHeight: "75vh", backgroundColor: "white", display: "flex", justifyContent: "center"}}>
                    {!cProf && !cTerm ? 
                        <CustomBarChart data={gradeData} />: <CustomBarChart data={filtered} /> 
                    }
                    <Flex vertical>
                        <Select style={{ width: "20vw", marginLeft: "16px", marginBottom: "1vh"}} onChange={(value) => {chooseProf(value)}} defaultValue="All Professors">
                            <Select.Option value="all professors">All Professors</Select.Option>
                            {profs.map((prof) => (
                                <Select.Option key={prof} value={prof}>{prof}</Select.Option>
                            ))}
                        </Select>
                        <Select style={{ width: "20vw", marginLeft: "16px", marginBottom: "1vh"}} onChange={(value) => {chooseTerm(value)}} defaultValue="All Terms">
                            <Select.Option value="all terms">All Terms</Select.Option>
                            {terms.map((term) => (
                                <Select.Option key={term} value={term}>{term}</Select.Option>
                            ))}
                        </Select>
                    </Flex>

                </Content>
                <Footer style={{ textAlign: "center", backgroundColor: "black"}}>
                    <Flex style={{justifyContent: "center"}}>
                        <p style={{color: "white", marginRight: "2vw"}}>Privacy Info</p>
                        <p style={{color: "white", marginLeft: "2vw"}}>Source Code</p>
                    </Flex>
                </Footer>
            </Layout>
        </>
    )
}