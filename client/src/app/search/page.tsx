'use client'

import { Layout, Select, Flex } from "antd";
import { Content, Footer } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import CustomBarChart from "../Components/CustomBarChart";
import Navbar from "../Components/Navbar";
import Link from "next/link";

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

export default function CourseDisplay(){
    const [gradeData, setGradeData] = useState<DataPoint[]>([]);
    const [rawData, setRawData] = useState<Grade[]>([]);
    const [cProf, setCProf] = useState<string>("");
    const [cTerm, setCTerm] = useState<string>("");
    const [filtered, setFiltered] = useState<DataPoint[]>([]);
    const [profs, setProfs] = useState<string[]>([]);
    const [terms, setTerms] = useState<string[]>([]);
    const [searched, setSearched] = useState("");
    
    type Season = 'F' | 'S' ;

    const seasonOrder: Record<Season, number> = {
        'S': 1, // Spring
        'F': 3  // Fall
    };

    const sortTerms = (terms: string[]): string[] => {
        return terms.sort((a, b) => {
            // Extract year and season from each term
            const yearA = parseInt(a.substring(0, 2));
            const yearB = parseInt(b.substring(0, 2));
            const seasonA = a.charAt(2) as Season;
            const seasonB = b.charAt(2) as Season;

            // Compare years first
            if (yearA !== yearB) {
                return yearB - yearA; // Descending order (most recent first)
            }

            // If years are equal, compare seasons
            return seasonOrder[seasonB] - seasonOrder[seasonA];
        });
    };

    const getGrades = async () => {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('query');
        if (query){
            setSearched(query);
        }else{
            setSearched("");
        }

        const res = await fetch(`https://vandy-courses-backend.onrender.com/api/grades/course/${query}`);
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
        setTerms(sortTerms(tmpTerms));
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

    useEffect(() => {
        getGrades();
    }, [])
    
    return (
        <>
            <Layout>
                <Navbar />
                <Content style={{ padding: '0 48px', alignItems: "center", minHeight: "77vh", backgroundColor: "white", display: "flex", justifyContent: "center"}}>
                    {!cProf && !cTerm ? 
                        <CustomBarChart data={gradeData} />: <CustomBarChart data={filtered} /> 
                    }
                    <Flex vertical>
                        <h1 style={{marginBottom: "3vh", display:"flex", justifyContent: "center"}}>{searched}</h1>
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