import React, { useState } from "react";
import { ResponsiveContainer } from "recharts";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default () => {
  const [data, setData] = useState();

  return (
    <ResponsiveContainer width={700} height="80%">
      <LineChart width={730} height={250} data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="metric" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="pv" stroke="#8884d8" />
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
      <button onClick={() => setData(data['value'] + 1)}>Click to increase value.</button>
    </ResponsiveContainer>
  );
};
