import React from "react";

import {
    BarChart,
    Bar,
    XAxis, 
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

type CustomBarChartProps = {
    data: { grade: string; frequency: number}[];
}

const gradeOrder = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];



const CustomBarChart: React.FC<CustomBarChartProps> = ({ data }) => {
    const defaultData = gradeOrder.map(grade => ({ grade, frequency: 0 }));

    // Merge defaultData with the actual data
    const sortedData = defaultData.map(defaultItem => {
        const actualItem = data.find(item => item.grade === defaultItem.grade);
        return actualItem ? actualItem : defaultItem;
    });

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={sortedData} margin={{ top: 20, right: 30, left: 20, bottom: 20}}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="grade" label={{ value: "Grades", position: "insideBottom", offset: -5}} />
                <YAxis label={{ value: "Frequency", angle: -90, position: "insideLeft"}} />
                <Tooltip />
                <Bar dataKey="frequency" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default CustomBarChart;