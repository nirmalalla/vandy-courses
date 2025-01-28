'use client'

import { Layout, Button, Select, Flex } from "antd";
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
    createdAt?: Date;
    updatedAt?: Date;
}
import { useRouter } from "next/navigation";

export default function CourseDisplay(){
    const [gradeData, setGradeData] = useState<DataPoint[]>([]);
    const [rawData, setRawData] = useState<Grade[]>([]);
    const [filtered, setFiltered] = useState<DataPoint[]>([]);
    const [profs, setProfs] = useState<string[]>([]);
    const router = useRouter();
    
    const getGrades = async () => {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('query');
        const res = await fetch(`http://localhost:5000/api/grades/course/${query}`);
        const data: Grade[] = await res.json();
        setRawData(data);

        let tmpProfs: string[] = [];

        for (let i = 0; i < data.length; i++){
            if (tmpProfs.indexOf(data[i].prof) == -1){
                tmpProfs.push(data[i].prof);
            }
        }

        setProfs(tmpProfs);
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
        if (prof === "all"){
            setFiltered([]);
        }else{
            let tmp = rawData.filter((grade) => grade.prof === prof);
            setFiltered(getFrequencies(tmp));
        }
    }


    const onClick = () => {
        router.push(`/post`);
    }
    useEffect(() => {
        getGrades();
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
                    {filtered.length === 0 ? 
                        <CustomBarChart data={gradeData} />: <CustomBarChart data={filtered} /> 
                    }
                    <Select style={{ width: "30vw", marginLeft: "16px" }} onChange={(value) => {chooseProf(value)}} defaultValue="All">
                        <Select.Option value="all">All</Select.Option>
                        {profs.map((prof) => (
                            <Select.Option value={prof}>{prof}</Select.Option>
                        ))}
                    </Select>
                </Content>
                <Footer style={{ textAlign: "center", backgroundColor: "black"}}>
                    <p style={{color: "white"}}>made by nirmal</p>
                </Footer>
            </Layout>
        </>
    )
}