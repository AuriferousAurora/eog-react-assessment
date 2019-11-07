import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  metricHeader__card: {
    alignItems: "center",
    background: "rgb(39,49,66)",
    borderRadius: "5px",
    color: "white",
    display: "flex",
    flexDirection: "column",
    height: "90%",
    margin: "0.8em",
    padding: "1em",
  },
  close: {
    color: "red",
    cursor: "pointer",
  },
});

export default (props) => {
  const classes = useStyles();

  const removeMetric = metricName => {
    props.setActiveMetrics(props.activeMetrics.filter(metric => metric !== metricName));
  }

  const cards = props.activeMetrics.map((metricName) => 
    <div key={metricName} className={classes.metricHeader__card} onClick={() => removeMetric(metricName)}>
      <div>{metricName}</div>
      <div>{props.latestMetrics[metricName].value}</div>
      <div className={classes.close}>[Remove]</div>
    </div>
  );

  return(
    <Fragment>{cards}</Fragment>
  );
}