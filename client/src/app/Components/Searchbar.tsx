'use client'

import { useEffect, useState } from "react";
import { AutoComplete, Button } from "antd";
import { useRouter } from "next/navigation";

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

    const onClick = () => {
        if (chosen.trim() !== ""){
            router.push(`/search?query=${encodeURIComponent(chosen)}`);
        }
    }

    useEffect(() => {
        getCourses();
    }, [])

    return (
        <div 
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px"
            }}
        >
            <AutoComplete
                value={chosen} 
                options={filteredOptions}
                style={{
                    width: 300, 
                    height: 40, 
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 12px"
                }}
                onChange={onChange}
                onSearch={onSearch}
                placeholder="Course Name"
                size="large"
            />
            <Button type="primary" onClick={onClick} style={{margin: 4}}>Search</Button>
        </div>
    )
}