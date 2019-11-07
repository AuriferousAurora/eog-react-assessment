import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  menu: {
    width: 200,
  },
    metricHeader__inputSelection: {
      width: "70%",
    }
}));

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

export default (props) => {
  const classes = useStyles();

  const handleChange = name => event => {
    if (name === "activeMetrics" && !props.activeMetrics.includes(event.target.value)) {
      props.setActiveMetrics(prev => [...prev, event.target.value]);
    }
  };

  return (
    <TextField
      id="metric-select-input-field"
      className={classes.metricHeader__inputSelection}
      select
      label="Select Metric"
      value={metricInputs}
      onChange={handleChange('activeMetrics')}
      SelectProps={{ MenuProps: { className: classes.menu, }, }}
      margin="normal"
      variant="outlined">
      {metricInputs.map(option => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    
    </TextField>
  );
};
    

