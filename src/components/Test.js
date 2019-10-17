import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Provider, createClient, useQuery } from "urql";

const useStyles = makeStyles({
  test: {
    width: "80%",
    height: "60%",
    background: "red",
  }
});

const client = createClient({
  url: "https://react.eogresources.com/graphql"
});

const query = `
  query($metricName: String!) {
    getLastKnownMeasurement(metricName: $metricName) {
      metric
      at
      value
      unit
    }
  }
`;

// Redux code that I don't need unless I finish the main objectives.
// const getLastKnownMeasurement = state => {
//   const { metric, at, value, unit } = state.lastKnownMeasurement;
//   return {
//     metric,
//     at,
//     value,
//     unit
//   };
// };

export default () => {
  return (
    <Provider value={client}>
      <Test />
    </Provider>
  );
};

const Test = () => {
  const classes = useStyles();

  const [metric, setMetric] = useState()

  const metricName = "tubingPressure";

  const [result] = useQuery({
    query,
    variables: {
      metricName
    }
  });

  // const { fetching, data, error } = result;
  
  // Will throw an error when attempting to declare variable that bind data
  // from unresolved query. Gotta include line 67.
  useEffect(
    () => {
      if (!result.data) return;
      // console.log(result.data.getLastKnownMeasurement);
      const { getLastKnownMeasurement } = result.data;
      console.log(getLastKnownMeasurement.metric);
      setMetric(getLastKnownMeasurement.metric)
    },
    [result.data]
  );

  // if (fetching) return <div>Loading...</div>;

  return (
    <Provider value={client}>
      <div className={classes.test}>
        Test
        {metric}
      </div>
    </Provider>

  );
};
