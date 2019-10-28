import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Provider, createClient, useQuery } from "urql";


import MetricSelector from "./MetricSelector";
import LinearProgress from "@material-ui/core/LinearProgress";
import HistoricMetrics from "./HistoricMetrics";

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

    setLatestMetrics({"tubingPressure": tubingPressureLatest, 
                      "flareTemp": flareTempLatest, 
                      "injValveOpen": injValveOpenLatest,
                      "oilTemp": oilTempLatest, 
                      "casingPressure": casingPressureLatest, 
                      "waterTemp": waterTempLatest});

  }, [data, error, setAllMetrics, setLatestMetrics]);

  const removeMetric = metricName => {
    setActiveMetrics(activeMetrics.filter(metric => metric !== metricName));
  }

  if (fetching || allMetrics.tubingPressure === undefined) { return <LinearProgress />;
  } else {

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
          <MetricSelector activeMetrics={activeMetrics} setActiveMetrics={setActiveMetrics} />
        </div>
      </div>
      <div className={classes.metricBody__chartContainer}>
        <HistoricMetrics 
          activeMetrics={activeMetrics} setActiveMetrics={setActiveMetrics}
          allMetrics={allMetrics} latestMetrics={latestMetrics}/>
      </div>

    </div>
  );
  }
};
