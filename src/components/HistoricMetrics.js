import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

export default (props) => {

  const convertMilliseconds = (stateObject) => {
    for (let i = 0; i < stateObject.length; i += 1) {
      const d = new Date(stateObject[i].at);
      let hours = d.getHours();
      if (hours > 12) hours = hours - 12;
      const minutes = d.getMinutes();
      stateObject[i].at = `${hours}:${minutes}`;
    }
  }

  if (typeof(props.allMetrics.tubingPressure[0].at) === "number") {
    convertMilliseconds(props.allMetrics.tubingPressure);
    convertMilliseconds(props.allMetrics.flareTemp);
    convertMilliseconds(props.allMetrics.injValveOpen);
    convertMilliseconds(props.allMetrics.oilTemp);
    convertMilliseconds(props.allMetrics.casingPressure);
    convertMilliseconds(props.allMetrics.waterTemp);
  }


  const dataKeyArray = Object.keys(props.allMetrics);
  const arrayLength = props.allMetrics[dataKeyArray[0]].length;
  const objLength = dataKeyArray.length;

  let chartData = [];

  for (let i = 0; i < arrayLength; i += 1) {
    let chartItem = {};
    for (let j = 0; j < objLength; j += 1) {
      if (j === 0) chartItem["time"] = props.allMetrics[dataKeyArray[j]][i].at;
      chartItem[dataKeyArray[j] + "Value"] = props.allMetrics[dataKeyArray[j]][i].value 
    }
    chartData.push(chartItem);
  }

  return (
    <LineChart 
      width={1200} height={400} data={chartData}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="time" interval={200}/>

      <YAxis 
        yAxisId="tubingPressure" 
        label={{ value: 'PSI', offset: 10, position: 'top' }}
        hide={props.activeMetrics.includes("tubingPressure") ? false : true} />
      <YAxis 
        yAxisId="flareTemp" 
        label={{ value: 'F', offset: 10, position: 'top' }}
        hide={props.activeMetrics.includes("flareTemp") ? false : true} />
      <YAxis 
        yAxisId="injValveOpen" 
        label={{ value: '%', offset: 10, position: 'top' }}
        hide={props.activeMetrics.includes("injValveOpen") ? false : true} />
      <YAxis 
        yAxisId="oilTemp" 
        label={{ value: 'F', offset: 10, position: 'top' }}
        hide={props.activeMetrics.includes("oilTemp") ? false : true} />
      <YAxis 
        yAxisId="casingPressure"
        label={{ value: 'PSI', offset: 10, position: 'top' }}
        hide={props.activeMetrics.includes("casingPressure") ? false : true} />
      <YAxis 
        yAxisId="waterTemp" 
        label={{ value: 'F', offset: 10, position: 'top' }}
        hide={props.activeMetrics.includes("waterTemp") ? false : true} />

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
  );
};