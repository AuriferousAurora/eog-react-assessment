import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Provider, createClient, useQuery } from "urql";
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles({
  metricWrapper: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
  },
  metricHeader: {
    display: "flex",
    height: "20%",
    width: "100%",
  },
  metricHeader__cardContainer: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    height: "100%",
    justifyContent: "flex-start",
    width: "80%",
  },
  metricHeader__card: {
    alignItems: "center",
    background: "rgb(39,49,66)",
    borderRadius: "5px",
    color: "white",
    display: "flex",
    flexDirection: "column",
    fontSize: "1.3em",
    height: "70%",
    margin: "0.8em",
    padding: "1em",
  },
  close: {
    color: "red",
    cursor: "pointer",
  },
  metricHeader__inputSelectionContainer: {
    alignItems: "center",
    display: "flex",
    justifyContent: "start",
    height: "100%",
    width: "20%",
  },
  metricHeader__inputSelection: {
    background: "white",
    fontSize: "2em",
    width: "70%",
  },
  metricBody__chartContainer: {
    alignItems: "center",
    display: "flex",
    height: "100%",
    justifyContent: "center",

  }
});

const client = createClient({
  url: "https://react.eogresources.com/graphql"
});

const time = new Date().valueOf() - 1800000;
const query = `{
  getMultipleMeasurements(input: [
    { metricName: "tubingPressure",
      after: ${time},
    }, {
      metricName: "flareTemp",
      after: ${time},
    }, {
      metricName: "injValveOpen",
      after: ${time},
    },  {
      metricName: "oilTemp",
      after: ${time},
    }, {
      metricName: "casingPressure",
      after: ${time},
    }, {
      metricName: "waterTemp",
      after: ${time},
    }
  ]) {
    metric
    measurements {
      at
      value
      unit
    }
  },
  tubingPressureLatest: getLastKnownMeasurement(metricName: "tubingPressure") {
    metric
    value
    unit
  },
  flareTempLatest: getLastKnownMeasurement(metricName: "flareTemp") {
    metric
    value
    unit
  },
  injValveOpenLatest: getLastKnownMeasurement(metricName: "injValveOpen") {
    metric
    value
    unit
  },
  oilTempLatest: getLastKnownMeasurement(metricName: "oilTemp") {
    metric
    value
    unit
  },
  casingPressureLatest: getLastKnownMeasurement(metricName: "casingPressure") {
    metric
    value
    unit
  },
  waterTempLatest: getLastKnownMeasurement(metricName: "waterTemp") {
    metric
    value
    unit
  }
}
`;


export default () => {
  return (
    <Provider value={client}>
      <MetricDisplay />
    </Provider>
  );
};

const MetricDisplay = () => {
  const classes = useStyles();

  const [activeMetrics, setActiveMetrics] = useState([]);
  const [allMetrics, setAllMetrics] = useState({});
  const [latestMetrics, setLatestMetrics] = useState({});

  const [result] = useQuery({
    query: query,
    requestPolicy: 'cache-and-network',
    pollInterval: 1300
  });

  const { fetching, data, error } = result

  useEffect(() => {
    if (error) {
      console.log(error);  
      return;
    }
    if (!data) return;
    const { getMultipleMeasurements } = data;
    const [tubingPressure, flareTemp, injValveOpen, oilTemp, casingPressure, waterTemp] = getMultipleMeasurements;

    setAllMetrics({"tubingPressure": tubingPressure.measurements, 
                   "flareTemp": flareTemp.measurements, 
                   "injValveOpen": injValveOpen.measurements,
                   "oilTemp": oilTemp.measurements, 
                   "casingPressure": casingPressure.measurements, 
                   "waterTemp": waterTemp.measurements});

    const {tubingPressureLatest, flareTempLatest, injValveOpenLatest, oilTempLatest, casingPressureLatest, waterTempLatest } = data;
    console.log(tubingPressureLatest);

    setLatestMetrics({"tubingPressure": tubingPressureLatest, 
                      "flareTemp": flareTempLatest, 
                      "injValveOpen": injValveOpenLatest,
                      "oilTemp": oilTempLatest, 
                      "casingPressure": casingPressureLatest, 
                      "waterTemp": waterTempLatest});

  }, [data, error, setAllMetrics, setLatestMetrics]);

  const handleChange = name => event => {
    if (name === "activeMetrics" && !activeMetrics.includes(event.target.value)) {
      setActiveMetrics(prev => [...prev, event.target.value]);
    }
  };

  const removeMetric = metricName => {
    setActiveMetrics(activeMetrics.filter(metric => metric !== metricName));
  }

  const metricInputs = [
    {
      value: 'tubingPressure',
      label: 'Tubing Pressure',
    },
    {
      value: 'flareTemp',
      label: 'Flare Temperature',
    },
    {
      value: 'injValveOpen',
      label: 'INJ Valve Open',
    },
    {
      value: 'oilTemp',
      label: 'Oil Temperature',
    },
    {
      value: 'casingPressure',
      label: 'Casing Pressure',
    },
    {
      value: 'waterTemp',
      label: 'Water Temperature',
    },
  ]

  if (fetching || allMetrics.tubingPressure === undefined) { return <LinearProgress />;
  } else {

  const convertMilliseconds = (stateObject) => {
    for (let i = 0; i < stateObject.length; i += 1) {
      const d = new Date(stateObject[i].at);
      let hours = d.getHours();
      if (hours > 12) hours = hours - 12;
      const minutes = d.getMinutes();
      stateObject[i].at = `${hours}:${minutes}`;
    }
  }
  
  if (typeof(allMetrics.tubingPressure[0].at) === "number") {
    convertMilliseconds(allMetrics.tubingPressure);
    convertMilliseconds(allMetrics.flareTemp);
    convertMilliseconds(allMetrics.injValveOpen);
    convertMilliseconds(allMetrics.oilTemp);
    convertMilliseconds(allMetrics.casingPressure);
    convertMilliseconds(allMetrics.waterTemp);
  }

  const dataKeyArray = Object.keys(allMetrics);
  const arrayLength = allMetrics[dataKeyArray[0]].length;
  const objLength = dataKeyArray.length;

  let chartData = [];

  for (let i = 0; i < arrayLength; i += 1) {
    let chartItem = {};
    for (let j = 0; j < objLength; j += 1) {
      if (j === 0) chartItem["time"] = allMetrics[dataKeyArray[j]][i].at;
      chartItem[dataKeyArray[j] + "Value"] = allMetrics[dataKeyArray[j]][i].value 
    }
    chartData.push(chartItem);
  }

  const cards = activeMetrics.map((metricName) => 
    <div key={metricName} className={classes.metricHeader__card} onClick={() => removeMetric(metricName)}>
      <span>{metricName}</span>
      <span>{latestMetrics[metricName].value}</span>
      <span/>
      <span className={classes.close}>[Remove]</span>
    </div>
  );

  return (
    <div className={classes.metricWrapper}>
      <div className={classes.metricHeader}>
        <div className={classes.metricHeader__cardContainer}>
          {cards}
        </div>
        <div className={classes.metricHeader__inputSelectionContainer}>

          <TextField
            id="standard-select-currency"
            className={classes.metricHeader__inputSelection}
            select
            label="Select Metric"
            value={metricInputs}
            onChange={handleChange('activeMetrics')}
            SelectProps={{ MenuProps: { className: classes.menu, }, }}
            margin="normal">
            {metricInputs.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

        </div>
      </div>

      <div className={classes.metricBody__chartContainer}>
      
        <LineChart 
          width={1200} height={400} data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" interval={200}/>

          <YAxis yAxisId="tubingPressure" hide={activeMetrics.includes("tubingPressure") ? false : true} />
          <YAxis yAxisId="flareTemp" hide={activeMetrics.includes("flareTemp") ? false : true} />
          <YAxis yAxisId="injValveOpen" hide={activeMetrics.includes("injValveOpen") ? false : true} />
          <YAxis yAxisId="oilTemp" hide={activeMetrics.includes("oilTemp") ? false : true} />
          <YAxis yAxisId="casingPressure" hide={activeMetrics.includes("casingPressure") ? false : true} />
          <YAxis yAxisId="waterTemp" hide={activeMetrics.includes("waterTemp") ? false : true} />

          {activeMetrics.includes("tubingPressure") ?
          <Line 
            yAxisId="tubingPressure" type="monotone" dataKey="tubingPressureValue" 
            stroke="#8884d8" dot={false} isAnimationActive={false}/> : ''}
          {activeMetrics.includes("flareTemp") ?
          <Line 
            yAxisId="flareTemp" type="monotone" dataKey="flareTempValue" 
            stroke="#c33c54" dot={false} isAnimationActive={false} /> : ''}
          {activeMetrics.includes("injValveOpen") ?
          <Line 
            yAxisId="injValveOpen" type="monotone" dataKey="injValveOpenValue" 
            stroke="#7bc950" dot={false} isAnimationActive={false} /> : ''}
          {activeMetrics.includes("oilTemp") ?
          <Line 
            yAxisId="oilTemp" type="monotone" dataKey="oilTempValue" 
            stroke="#e11584" dot={false} isAnimationActive={false} /> : ''}
          {activeMetrics.includes("casingPressure") ?
          <Line 
            yAxisId="casingPressure" type="monotone" dataKey="casingPressureValue" 
            stroke="#e9ce2c" dot={false} isAnimationActive={false} /> : ''}
          {activeMetrics.includes("waterTemp") ?
          <Line 
            yAxisId="waterTemp" type="monotone" dataKey="waterTempValue" 
            stroke="#03f7eb" dot={false} isAnimationActive={false} /> : ''}

          <Tooltip />
        </LineChart>

      </div>

    </div>
  );
  }
};
