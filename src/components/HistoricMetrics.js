// import React from "react";
// import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

// export default () => {
//   return (
//     <LineChart 
//       width={1200} height={400} data={chartData}
//       margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//       <CartesianGrid strokeDasharray="3 3" />
//       <XAxis dataKey="time" interval={200}/>

//       <YAxis 
//         yAxisId="tubingPressure" 
//         label={{ value: 'PSI', offset: 10, position: 'top' }}
//         hide={activeMetrics.includes("tubingPressure") ? false : true} />
//       <YAxis 
//         yAxisId="flareTemp" 
//         label={{ value: 'F', offset: 10, position: 'top' }}
//         hide={activeMetrics.includes("flareTemp") ? false : true} />
//       <YAxis 
//         yAxisId="injValveOpen" 
//         label={{ value: '%', offset: 10, position: 'top' }}
//         hide={activeMetrics.includes("injValveOpen") ? false : true} />
//       <YAxis 
//         yAxisId="oilTemp" 
//         label={{ value: 'F', offset: 10, position: 'top' }}
//         hide={activeMetrics.includes("oilTemp") ? false : true} />
//       <YAxis 
//         yAxisId="casingPressure"
//         label={{ value: 'PSI', offset: 10, position: 'top' }}
//         hide={activeMetrics.includes("casingPressure") ? false : true} />
//       <YAxis 
//         yAxisId="waterTemp" 
//         label={{ value: 'F', offset: 10, position: 'top' }}
//         hide={activeMetrics.includes("waterTemp") ? false : true} />

//       {activeMetrics.includes("tubingPressure") ?
//       <Line 
//         yAxisId="tubingPressure" type="monotone" dataKey="tubingPressureValue" 
//         stroke="#8884d8" dot={false} isAnimationActive={false}/> : ''}
//       {activeMetrics.includes("flareTemp") ?
//       <Line 
//         yAxisId="flareTemp" type="monotone" dataKey="flareTempValue" 
//         stroke="#c33c54" dot={false} isAnimationActive={false} /> : ''}
//       {activeMetrics.includes("injValveOpen") ?
//       <Line 
//         yAxisId="injValveOpen" type="monotone" dataKey="injValveOpenValue" 
//         stroke="#7bc950" dot={false} isAnimationActive={false} /> : ''}
//       {activeMetrics.includes("oilTemp") ?
//       <Line 
//         yAxisId="oilTemp" type="monotone" dataKey="oilTempValue" 
//         stroke="#e11584" dot={false} isAnimationActive={false} /> : ''}
//       {activeMetrics.includes("casingPressure") ?
//       <Line 
//         yAxisId="casingPressure" type="monotone" dataKey="casingPressureValue" 
//         stroke="#e9ce2c" dot={false} isAnimationActive={false} /> : ''}
//       {activeMetrics.includes("waterTemp") ?
//       <Line 
//         yAxisId="waterTemp" type="monotone" dataKey="waterTempValue" 
//         stroke="#03f7eb" dot={false} isAnimationActive={false} /> : ''}
//       <Tooltip />
//     </LineChart>
//   );
// };