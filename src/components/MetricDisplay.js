import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Provider, createClient, useQuery } from "urql";
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import LinearProgress from "@material-ui/core/LinearProgress";

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

const time = new Date().valueOf() - 1800000;
const allMeasurementsQuery = `{
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
  const [allMetrics, setAllMetrics] = useState({});

  const [allMeasurementsResult] = useQuery({
    query: allMeasurementsQuery
  });

  const { fetching, data, error } = allMeasurementsResult

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
                   "waterTemp": waterTemp.measurements,
  });
  }, [data, error, setAllMetrics]);

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

  convertMilliseconds(allMetrics.tubingPressure);
  convertMilliseconds(allMetrics.flareTemp);
  convertMilliseconds(allMetrics.injValveOpen);
  convertMilliseconds(allMetrics.oilTemp);
  convertMilliseconds(allMetrics.casingPressure);
  convertMilliseconds(allMetrics.waterTemp);

  console.log(allMetrics);

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
        <p>{allMetrics.tubingPressure[0].at}</p>
        <p>{allMetrics.flareTemp[1].at}</p>
        <p>{allMetrics.injValveOpen[2].at}</p>
        <p>{allMetrics.oilTemp[3].at}</p>
        <p>{allMetrics.casingPressure[4].at}</p>
        <p>{allMetrics.waterTemp[100].at}</p>
      <div>
      </div>
      
        <LineChart width={700} height={250} data={allMetrics.tubingPressure}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="at" />
          <YAxis dataKey="value"/>
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
    </div>
  );
  }
};
