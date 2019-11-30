import React, { useState, useEffect, useReducer } from "react";
// import { plotState, plotReducer } from "../store/reducers/plots";
import { StyleSheet, View, Button, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useSelector, useDispatch } from "react-redux";
import { useFirebaseConnect } from "react-redux-firebase";
import {
  getUserCoords,
  coordsState,
  coordsReducer
} from "../store/reducers/coords";
import useThunkReducer from "react-hook-thunk-reducer";
// import {createSelector} from "reselect"

export default DropMap = props => {
  const [location, dispatch] = useThunkReducer(coordsReducer, coordsState);
  useEffect(() => {
    dispatch(getUserCoords());
  });
  useFirebaseConnect(["Plots"]);
  const plots = useSelector(state => state.firebase.plots);

  return (
    <MapView
      style={styles.map}
      region={{
        latitude: location.lat,
        longitude: location.long,
        latitudeDelta: 0.017,
        longitudeDelta: 0.019
      }}
    >
      <Marker
        coordinate={{
          latitude: location.lat,
          longitude: location.long,
          error: 0
        }}
        pinColor="#4CB8EF"
        onPress={() => props.navigation.navigate("Home")}
      />
      {plots &&
        plots.map(plot => {
          return (
            <Marker
              key={plot.d.name}
              coordinate={{
                latitude: plot.d.coordinates.latitude,
                longitude: plot.d.coordinates.longitude
              }}
            />
          );
        })}
    </MapView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  }
});
