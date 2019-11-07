import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Provider, createClient, useQuery } from "urql";

import LinearProgress from "@material-ui/core/LinearProgress";
import MetricCards from "./MetricCards";
import MetricSelector from "./MetricSelector";
import MetricHistory from "./MetricHistory";

const useStyles = makeStyles({
  metricWrapper: {
    display: "flex",
    flexDirection: "column",
    height: "90%",
    width: "100%",
  },
  metricHeader: {
    display: "flex",
    height: "15%",
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
  metricHeader__inputSelectionContainer: {
    alignItems: "center",
    display: "flex",
    justifyContent: "start",
    height: "100%",
    width: "20%",
  },
  metricBody__chartContainer: {
    alignItems: "center",
    display: "flex",
    height: "85%",
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

    setLatestMetrics({"tubingPressure": tubingPressureLatest, 
                      "flareTemp": flareTempLatest, 
                      "injValveOpen": injValveOpenLatest,
                      "oilTemp": oilTempLatest, 
                      "casingPressure": casingPressureLatest, 
                      "waterTemp": waterTempLatest});

  }, [data, error, setAllMetrics, setLatestMetrics]);

  if (fetching || allMetrics.tubingPressure === undefined) { return <LinearProgress />;
  } else {

  return (
    <div className={classes.metricWrapper}>
      <div className={classes.metricHeader}>
        <div className={classes.metricHeader__cardContainer}>
          <MetricCards 
            activeMetrics={activeMetrics} setActiveMetrics={setActiveMetrics}
            latestMetrics={latestMetrics} />
        </div>
        <div className={classes.metricHeader__inputSelectionContainer}>
          <MetricSelector 
            activeMetrics={activeMetrics} setActiveMetrics={setActiveMetrics} />
        </div>
      </div>
      <div className={classes.metricBody__chartContainer}>
        <MetricHistory
          activeMetrics={activeMetrics} setActiveMetrics={setActiveMetrics}
          allMetrics={allMetrics} latestMetrics={latestMetrics}/>
      </div>

    </div>
  );
  }
};
