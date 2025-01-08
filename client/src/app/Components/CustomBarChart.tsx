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


const CustomBarChart: React.FC<CustomBarChartProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20}}>
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