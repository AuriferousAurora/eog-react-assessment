import React from "react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

export default (props) => {

  const convertMilliseconds = (allMetrics) => {
    const cMetrics = Object.keys(allMetrics);
    const cObjLength = cMetrics.length;
    const cArrayLength = allMetrics[cMetrics[0]].length;

    for (let i = 0; i < cObjLength; i += 1) {
      for (let j = 0; j < cArrayLength; j += 1) {
        const date = new Date(allMetrics[cMetrics[i]][j].at);
        let hours = date.getHours();
        if (hours > 12) hours = hours - 12;
        const minutes = date.getMinutes();
        allMetrics[cMetrics[i]][j].at = `${hours}:${minutes}`;
      }
    }
  }

  if (typeof(props.allMetrics.tubingPressure[0].at) === "number") convertMilliseconds(props.allMetrics);

  let chartData = [];

  const metrics = Object.keys(props.allMetrics);
  const objLength = metrics.length;
  const arrayLength = props.allMetrics[metrics[0]].length;

  for (let i = 0; i < arrayLength; i += 1) {
    let chartItem = {};
    for (let j = 0; j < objLength; j += 1) {
      if (j === 0) chartItem["time"] = props.allMetrics[metrics[j]][i].at;
      chartItem[metrics[j] + "Value"] = props.allMetrics[metrics[j]][i].value 
    }
    chartData.push(chartItem);
  }

  const yAxes = Object.keys(props.allMetrics).map((metric) => 
    <YAxis 
      key={metric} yAxisId={metric} 
      label={{ value: props.allMetrics[metric][0].unit, offset: 10, position: 'top' }}
      hide={props.activeMetrics.includes(metric) ? false : true} />
  )

  return (
    <ResponsiveContainer width={'90%'} height={'80%'}>
      <LineChart 
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" interval={200}/>
        {yAxes}

        {props.activeMetrics.includes("tubingPressure") ?
        <Line 
          yAxisId="tubingPressure" type="monotone" dataKey="tubingPressureValue" 
          stroke="#8884d8" dot={false} isAnimationActive={false}/> : ''}
        {props.activeMetrics.includes("flareTemp") ?
        <Line 
          yAxisId="flareTemp" type="monotone" dataKey="flareTempValue" 
          stroke="#c33c54" dot={false} isAnimationActive={false} /> : ''}
        {props.activeMetrics.includes("injValveOpen") ?
        <Line 
          yAxisId="injValveOpen" type="monotone" dataKey="injValveOpenValue" 
          stroke="#7bc950" dot={false} isAnimationActive={false} /> : ''}
        {props.activeMetrics.includes("oilTemp") ?
        <Line 
          yAxisId="oilTemp" type="monotone" dataKey="oilTempValue" 
          stroke="#e11584" dot={false} isAnimationActive={false} /> : ''}
        {props.activeMetrics.includes("casingPressure") ?
        <Line 
          yAxisId="casingPressure" type="monotone" dataKey="casingPressureValue" 
          stroke="#e9ce2c" dot={false} isAnimationActive={false} /> : ''}
        {props.activeMetrics.includes("waterTemp") ?
        <Line 
          yAxisId="waterTemp" type="monotone" dataKey="waterTempValue" 
          stroke="#03f7eb" dot={false} isAnimationActive={false} /> : ''}
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
};