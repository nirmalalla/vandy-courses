'use client'

import { useEffect, useState } from "react";
import { AutoComplete } from "antd";

interface CourseName{
    course?: string
}

interface Option{
    value?: string
}

export default function SearchBar(){
    const [allOptions, setAllOptions] = useState<Option[]>([]);
    const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
    const [chosen, setChosen] = useState("");

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

    useEffect(() => {
        getCourses();
    }, [])

    return (
        <>
            <AutoComplete
                value={chosen} 
                options={filteredOptions}
                style={{width: 200}}
                onChange={onChange}
                onSearch={onSearch}
                placeholder="search course"
                size="large"
            />
        </>
    )
}