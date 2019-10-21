import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Provider, createClient, useQuery } from "urql";
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { useFavicon } from "react-use";

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

const allMeasurements = `{
  getMultipleMeasurements(input: [
    { metricName: "tubingPressure",
      after: $time,
    }, {
      metricName: "flareTemp",
      after: $time,
    }, {
      metricName: "injValveOpen",
      after: $time,
    },  {
      metricName: "oilTemp",
      after: $time,
    }, {
      metricName: "casingPressure",
      after: $time,
    }, {
      metricName: "waterTemp",
      after: $time,
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

  const metrics = ["tubingPressure, flareTemp, injValveOpen, oilTemp, casingPressure, waterTemp"]

  // for (let i = 0; i < metrics.length; i += 1) {
  //   const metricName = metrics[0];
    // const [lastKnownResult] = useQuery({ 
    //   query: lastKnownQuery, 
    //   variables: { metricName }
    // });

    // const { data, error } = lastKnownResult;

    // if (!data) continue;
    // const { getLastKnownMeasurement } = data;
    // const glkm = getLastKnownMeasurement;
    // setLastKnownMetrics({ [metrics[i]]: {"at": glkm.at,"unit": glkm.unit, "value": glkm.value, "active": false} });
    // if (activeMetrics.includes(metrics[i])) { setLastKnownMetrics([metrics[i]]["active"] = true); }
  // }


  // const useLastKnownQueries = () => {
  //   const tubingPressure = "tubingPressure";
  //   const flareTemp = "flareTemp";
  //   const injValveOpen = "injValveOpen";
  //   const oilTemp = "oilTemp";
  //   const casingPressure = "casingPressure";
  //   const waterTemp = "waterTemp";

  //   const tpResponse = useQuery({ query: lastKnownQuery, variables: { tubingPressure }});
  //   const ftResponse = useQuery({ query: lastKnownQuery, variables: { flareTemp }});
  //   const ivoResponse = useQuery({ query: lastKnownQuery, variables: { injValveOpen }});
  //   const otResponse = useQuery({ query: lastKnownQuery, variables: { oilTemp }});
  //   const cpResponse = useQuery({ query: lastKnownQuery, variables: { casingPressure }});
  //   const wtResponse = useQuery({ query: lastKnownQuery, variables: { waterTemp }});

  //   return [tpResponse, ftResponse, ivoResponse, otResponse, cpResponse, wtResponse];
  // }

  const d = new Date().valueOf() - 60000;

  const [allMeasurementsResult] = useQuery({
    query: allMeasurements,
    variables: { d }
  });

  const { fetching, data, error } = allMeasurementsResult

  useEffect(() => {
    if (fetching) console.log("Fetching.");
    if (!data) return;
    if (error) console.log(error);  
    console.log(data);
  }, [fetching, data, error]);

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
