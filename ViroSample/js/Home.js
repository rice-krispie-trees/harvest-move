import React, { useEffect } from "react";
import useThunkReducer from "react-hook-thunk-reducer";
import { View, Text } from "react-native";
import { Actions } from "react-native-router-flux";
import {
  getUserCoords,
  coordsState,
  coordsReducer
} from "../store/reducers/coords";

export default function Home() {
  const [state, dispatch] = useThunkReducer(coordsReducer, coordsState);
  useEffect(() => {
    dispatch(getUserCoords());
  });
  return (
    <View>
      <Text onPress={() => Actions.map()}>Behold, our home page.</Text>
      <View>
        <Text onPress={() => Actions.ar()}>Click here to go to AR mode.</Text>
        <View>
          <Text>Latitude: {state.lat}</Text>
          <View>
            <Text>Longitude: {state.long}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
