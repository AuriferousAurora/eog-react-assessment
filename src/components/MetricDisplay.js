import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Provider, createClient, useQuery } from "urql";
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles({
  metricHeader: {
    display: "flex",
    height: "10%",
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

const lastKnownQuery = `
query($metricName: String!) {
  getLastKnownMeasurement(metricName: $metricName) {
    metric
    at
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
  const [lastKnownMetrics, setLastKnownMetrics] = useState({});

  const metricName = "tubingPressure";

  const [lastKnownResult] = useQuery({ 
    query: lastKnownQuery, 
    variables: { metricName }
  });
  console.log(lastKnownResult);

  const { data, error } = lastKnownResult;


  useEffect(
    () => {
      setLastKnownMetrics([data]);
      console.log(lastKnownMetrics)
    },
    [data, error]
  );

  const handleChange = name => event => {
    if (name === "activeMetrics" && !activeMetrics.includes(event.target.value)) {
      setActiveMetrics(prev => [...prev, event.target.value]);
    }
    console.log(activeMetrics);
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

  return (
    <Provider value={client}>
      <div className={classes.metricHeader}>
        <div className={classes.metricHeader__cards}>
          <div>
              {/* <p>{lkName}</p>
              <p>{lkValue} {lkUnit}</p> */}
          </div>
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
    </Provider>

  );
};
