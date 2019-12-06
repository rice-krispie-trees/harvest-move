/**
 * Copyright (c) 2017-present, Viro, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import React, { Component } from "react";
import { Provider } from "react-redux";

import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  PixelRatio,
  TouchableHighlight
} from "react-native";
import { Router, Scene, Stack } from "react-native-router-flux";
import { Login, Home, CropMap, AR, Basket } from "./js";
import configureStore from "./store";

import { firebaseConfig } from "./firebase/config";
import { FirebaseWrapper } from "./firebase/firebase";

const store = configureStore();
/*
 TODO: Insert your API key below
 */
var sharedProps = {
  apiKey: "API_KEY_HERE"
};

class ViroSample extends Component {
  constructor() {
    super();

    this.state = {
      sharedProps: sharedProps
    };
    this._exitViro = this._exitViro.bind(this);
  }

  render() {
    FirebaseWrapper.GetInstance().Initialize(firebaseConfig);
    return (
      <Provider store={store}>
        <Router
          navigationBarStyle={{ backgroundColor: "#F8C752" }}
          titleStyle={{ color: "rgba(255,255,255,1)" }}
        >
          <Stack key="root">
            <Scene
              key="login"
              component={Login}
              title="Welcome to Harvest Move"
            />
            <Scene key="home" component={Home} title="Harvest Move" />
            <Scene key="map" component={CropMap} title="My Map" />
            <Scene key="ar" component={AR} />
          </Stack>
        </Router>
      </Provider>
    );
  }

  // This function "exits" Viro by setting the navigatorType to UNSET.
  _exitViro() {
    this.setState({
      navigatorType: UNSET
<<<<<<< HEAD
    })
=======
    });
>>>>>>> e3dbe8908de0c2b83c5037c49972f22a2c689fc1
  }
}

var localStyles = StyleSheet.create({
  viroContainer: {
    flex: 1,
    backgroundColor: "black"
  },
  outer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "black"
  },
  inner: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "black"
  },
  titleText: {
    paddingTop: 30,
    paddingBottom: 20,
    color: "#fff",
    textAlign: "center",
    fontSize: 25
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 20
  },
  buttons: {
    height: 80,
    width: 150,
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#68a0cf",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff"
  },
  exitButton: {
    height: 50,
    width: 100,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#68a0cf",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff"
  }
});

module.exports = ViroSample;
