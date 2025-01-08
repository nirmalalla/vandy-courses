'use client'

import { Layout, Button } from "antd";
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

export default function CourseDisplay(){
    const [gradeData, setGradeData] = useState<DataPoint[]>([]);
    
    const getGrades = async () => {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('query');
        const res = await fetch(`http://localhost:5000/api/grades/course/${query}`);
        const data = await res.json();

        getFrequencies(data);
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

        setGradeData(frequencyArray);
    }

    useEffect(() => {
        getGrades();
    }, [])
    
    return (
        <>
            <Layout>
                <Header style={{ display: "flex", minHeight: "15vh", backgroundColor: "white", alignItems: "center"}}>
                    <h1 style={{padding: 4}}>vandycourses</h1>
                    <Button variant="text" color="default">Post</Button>
                </Header>
                <Content style={{ padding: '0 48px', alignItems: "center", minHeight: "75vh", backgroundColor: "white", display: "flex", justifyContent: "center"}}>
                    <CustomBarChart data={gradeData} />
                </Content>
                <Footer style={{ textAlign: "center", backgroundColor: "black"}}>
                    <p style={{color: "white"}}>made by nirmal</p>
                </Footer>
            </Layout>
        </>
    )
}