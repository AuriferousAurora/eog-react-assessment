import React, { useState, useEffect } from "react";
import { Provider, createClient, useQuery } from "urql";
import { useGeolocation } from "react-use";
import LinearProgress from "@material-ui/core/LinearProgress";

const client = createClient({
    url: "https://react.eogresources.com/graphql"
});

const query = `
query($latLong: WeatherQuery!) {
    getWeatherForLocation(latLong: $latLong) {
        description
        locationName
        temperatureinCelsius
    }
}`;

export default () => {
    return (
        <Provider value={client}>
            <Test />
        </Provider>
    );
};

const Test = () => {
    const getLocation = useGeolocation();

    const latLong = {
        latitude: getLocation.latitude || 29.7604,
        longitude: getLocation.longitude || -95.3698
    };

    const [weather, setWeather] = useState({"temperatureinCelsius": null,
                                            "description": null,
                                            "locationName": null});

    const [result] =  useQuery({
        query,
        variables: {
            latLong
        }
    })

    const { fetching, data, error } = result;

    useEffect(() => {
        if (error) {
            console.log(error);
            return;
        }
        if (!data) return;
        const { getWeatherForLocation } = data;
        setWeather({"temperatureinCelsius": getWeatherForLocation.temperatureinCelsius,
                    "description": getWeatherForLocation.description,
                    "locationName": getWeatherForLocation.locationName});
        },
        [setWeather, data, error]
    );

    if (fetching) return <LinearProgress />;

    return (
        <div>
            <p>{weather.temperatureinCelsius}</p>
            <p>{weather.description}</p>
            <p>{weather.locationName}</p>
        </div>
    );
};
