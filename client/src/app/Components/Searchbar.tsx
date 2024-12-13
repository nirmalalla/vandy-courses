'use client'

import { useEffect, useState } from "react";

export default function SearchBar(){
    const [options, setOptions] = useState([]);
    const getCourses = async () => {
        const res = await fetch("http://localhost:5000/api/grades/course", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();
        const courses = data.map((item: any) => item.course);
        console.log(courses);
        setOptions(courses);
    }

    useEffect(() => {
        getCourses();
    })

    return (
        <>
            <p>test</p>
        </>
    )
}