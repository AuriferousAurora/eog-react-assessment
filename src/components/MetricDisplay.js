import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Provider, createClient, useQuery } from "urql";
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { ResponsiveContainer } from "recharts";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

const useStyles = makeStyles({
  metricHeader: {
    display: "flex",
    height: "20%",
    width: "100%",
  },
  metricHeader__cards: {
    height: "100%",
    width: "70%",
    background: "blue",
  },
  metricHeader__inputSelectionContainer: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    height: "100%",
    width: "30%",
    background: "red",
  },
  metricHeader__inputSelection: {
    width: "50%",
  }
});

const client = createClient({
  url: "https://react.eogresources.com/graphql"
});

const time = new Date().valueOf() - 60000;
const allMeasurements = `{
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
  const [lastKnownMetrics, setLastKnownMetrics] = useState({"tubingPressure": {},
                                                            "flareTemp": {},
                                                            "injValveOpen": {},
                                                            "oilTemp": {},
                                                            "casingPressure": {},
                                                            "waterTemp": {} });
  const [am, setAm] = useState();
                                                          

  const metrics = ["tubingPressure, flareTemp, injValveOpen, oilTemp, casingPressure, waterTemp"];

  const [allMeasurementsResult] = useQuery({
    query: allMeasurements
  });

  const { fetching, data, error } = allMeasurementsResult

  useEffect(() => {
    if (fetching) console.log("Fetching.");
    if (!data) return;
    if (error) console.log(error);  
    const { getMultipleMeasurements } = data;
    const tubingPressureData = []
    // for (let i = 0; i < getMultipleMeasurements.length; i += 1) {

    // }
    const measurements = getMultipleMeasurements[0].measurements;
    for (let i = 0; i < measurements.length; i += 1) {
      tubingPressureData.push({"time": measurements[i].at, "value": measurements[i].value });
    }
    setAm(tubingPressureData);
    console.log(am);
  }, [fetching, data, error, am]);

  const handleChange = name => event => {
    if (name === "activeMetrics" && !activeMetrics.includes(event.target.value)) {
      setActiveMetrics(prev => [...prev, event.target.value]);
    }
  };

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
      value: 'casingPresure',
      label: 'Casing Pressure',
    },
    {
      value: 'waterTemp',
      label: 'Water Temperature',
    },
  ]

  const abc = [1,2,3];
  return (
    <div className={classes.metricWrapper}>
      <div className={classes.metricHeader}>
        <div className={classes.metricHeader__cards}>
          {activeMetrics}
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
      
      <ResponsiveContainer width={1000} height="80%">
        <LineChart width={700} height={250} data={am}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="value" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="pv" stroke="#8884d8" />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
    </ResponsiveContainer>
    </div>
  );
};
