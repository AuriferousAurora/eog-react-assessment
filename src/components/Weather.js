import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../store/actions";
import { Provider, createClient, useQuery } from "urql";
import { useGeolocation } from "react-use";
import LinearProgress from "@material-ui/core/LinearProgress";
import Chip from "./Chip";


// I'm guessing that this function returns an object that allows you to interact with the GraphQL API.
const client = createClient({
  url: "https://react.eogresources.com/graphql"
});

// Establish a vairable that contains the query you want to send.
const query = `
query($latLong: WeatherQuery!) {
  getWeatherForLocation(latLong: $latLong) {
    description
    locationName
    temperatureinCelsius
  }
}
`;

// Function getWeather, takes on argument (state) and grabs the
// temperatureFahrenheit, description, and locationName from the state object.
// It then returns those in what looks to be either object literal syntax or GraphQL query syntax.
const getWeather = state => {
  const { temperatureinFahrenheit, description, locationName } = state.weather;
  return {
    temperatureinFahrenheit,
    description,
    locationName
  };
};

// This is the default function which is a component. It's the weather component wrapped in a Provider.
export default () => {
  return (
    <Provider value={client}>
      <Weather />
    </Provider>
  );
};

// Here's that weather component.
const Weather = () => {
  // This instantiates the GeoLocation thing from react-use.
  const getLocation = useGeolocation();
  // This variable gets either the input lat and long or defaults to Houston.
  // There doesn't seem to be a way to change the location, so it probably only gets Houston.
  const latLong = {
    latitude: getLocation.latitude || 29.7604,
    longitude: getLocation.longitude || -95.3698
  };
  // I'll need to look into this.
  const dispatch = useDispatch();
  // So, getWeather seems to be a special kind of function that gets passed to useSelector.
  // I'll have to look into that. I've got some documentation to read.
  const { temperatureinFahrenheit, description, locationName } = useSelector(
    getWeather
  );
  
  // An array of results is returned from this code. I'll really have to read these docs.
  const [result] = useQuery({
    query,
    variables: {
      latLong
    }
  });
  // Grab out fetching, data, and error from the result array (at least I think it's an array.)
  const { fetching, data, error } = result;
  // Definitely going to need to reread the hook documentaion.
  useEffect(
    () => {
      if (error) {
        dispatch({ type: actions.API_ERROR, error: error.message });
        return;
      }
      if (!data) return;
      const { getWeatherForLocation } = data;
      dispatch({ type: actions.WEATHER_DATA_RECEIVED, getWeatherForLocation });
    },
    [dispatch, data, error]
  );

  if (fetching) return <LinearProgress />;

  return (
    <Chip
      label={`Weather in ${locationName}: ${description} and ${temperatureinFahrenheit}°`}
    />
  );
};
