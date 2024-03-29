import React from "react";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import Weather from "./Weather";

const useStyles = makeStyles({
  grow: {
    flexGrow: 1,
    height: '10%'
  }
});

export default () => {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit" className={classes.grow}>
          React Metric Visualization Application
        </Typography>
        <Weather />
      </Toolbar>
    </AppBar>
  );
};
