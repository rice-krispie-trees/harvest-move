import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import useThunkReducer from "react-hook-thunk-reducer";
import { StyleSheet, Vibration } from "react-native";
import { useFirebaseConnect } from "react-redux-firebase";
import { useParams } from "react-router-dom";
import {
  ViroARScene,
  ViroText,
  ViroConstants,
  ViroMaterials,
  ViroARSceneNavigator,
  ViroARPlane,
  ViroARPlaneSelector,
  ViroAmbientLight,
  ViroBox,
  ViroButton,
  ViroParticleEmitter
} from "react-viro";
import { PLOT_WIDTH, PLOT_LENGTH, PLOT_HEIGHT } from "./constants";
import {
  getAllPlots,
  makeNewPlot,
  plotState,
  plotReducer
} from "../store/redux/plots";

class Plot {
  constructor(lat, lng) {
    this.lat = lat;
    this.long = lng;
    this.visible = false;
  }
}

const plots = [];
for (let i = 40.704546; i < 40.705547; i += 0.00005) {
  for (let j = -74.009598; j < -74.008598; j += 0.00005) {
    plots.push(new Plot(i, j));
  }
}

const ARHook = props => {
  const { plotId } = useParams();
  useFirebaseConnect([`Plots/${props.params.plotId}/d`]); //sets up listener in db for updates in component

  const plot = useSelector(
    ({ firebase: { data } }) => data.Plots && data.Plots[plotId]
  );

  const dispatch = useDispatch();
  const [text, setText] = useState("Initializing AR...");

  const [error, setError] = useState(false);
  const [plots, setPlots] = useState([]);
  const [anchorsFound, setAnchorsFound] = useState([]);
  const [water, setWater] = useState(false);
  const [seeds, setSeeds] = useState(false);
  const [pick, setPick] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [animateSeeds, setAnimateSeeds] = useState(false);

  const latLongToMerc = (lat_deg, lon_deg) => {
    var lon_rad = (lon_deg / 180.0) * Math.PI;
    var lat_rad = (lat_deg / 180.0) * Math.PI;
    var sm_a = 6378137.0;
    var xmeters = sm_a * lon_rad;
    var ymeters = sm_a * Math.log((Math.sin(lat_rad) + 1) / Math.cos(lat_rad));
    return { x: xmeters, y: ymeters };
  };

  const mercToLatLong = (relative_x, relative_z) => {
    const lat = relative_z / 111111.1 + crdsState.lat;
    const lng =
      relative_x / (111111.1 * Math.cos(crdsState.lat)) + crdsState.lng;
    return { lat, lng };
  };

  const getARCoords = (plot, y) => {
    const plotMerc = latLongToMerc(
      plot.coordinates.latitude,
      plot.coordinates.longitude
    );
    const selfMerc = latLongToMerc(crdsState.lat, crdsState.lng);
    const plotARZ = plotMerc.y - selfMerc.y;
    const plotARX = plotMerc.x - selfMerc.x;
    return [plotARX, y, -plotARZ];
  };

  const onHover = anchor => {
    const plot = plotHere(anchor);
    return function(isHovering, position, source) {
      if (isHovering) {
        plot.datePlanted && !plot.watered ? setWater(plot) : setWater(null);
        !plot.datePlanted ? setSeeds(plot) : setSeeds(null);
        plot.ripe ? setPick(plot) : setPick(null);
      } else {
        setWater(null);
        setSeeds(null);
        setPick(null);
      }
    };
  };

  const onSelected = async anchor => {
    const { lat, lng } = mercToLatLong(anchor.center[2], anchor.center[0]);
    await makeNewPlot(lat, lng);
  };

  const plotHere = anchor => {
    const { plots } = props;
    for (let i = 0; i < plots.length; i++) {
      const [x, y, z] = getARCoords(plots[i]);
      if (
        Math.abs(x - anchor.position[0]) < PLOT_WIDTH &&
        Math.abs(z - anchor.position[2]) < PLOT_LENGTH
      ) {
        return plots[i];
      }
    }
  };

  const onAnchorFound = anchor => {
    if (plotHere(anchor)) {
      const newAnchors = [...anchorsFound];
      newAnchors.push(anchor);
      setAnchorsFound(newAnchors);
    }
  };

  const getPlotButton = plot => {
    console.log("in the plot button function");
    if (water === plot) return ["waterButton"];
    else if (seeds === plot) return ["seedButton"];
    return ["frontMaterial"];
  };

  const onClick = plot => {
    console.log(
      "I regret to inform you that the outer onClick is being invoked."
    );
    if (seeds === plot) {
      firebase.update(`Plots/${params.plotId}/d`, {
        alive: true,
        datePlanted: new Date()
      });
      Vibration.vibrate();
      Vibration.cancel();
      setAnimateSeeds(true);
    } else if (water === plot) {
      firebase.update(`Plots/${params.plotId}/d`, {
        waterCount: plot.d.waterCount + 1,
        wateredDate: new Date()
      });
    } else if (pick === plot) {
      firebase.update(`Plots/${params.plotId}/d`, {
        alive: false,
        datePlanted: null,
        ripe: false,
        sprouted: false,
        waterCount: 0,
        wateredDate: null
      });
    }
  };

  const onInitialized = (state, reason) => {
    if (state == ViroConstants.TRACKING_NORMAL) {
      loaded ? setText("Done") : setText("Not Done");
    } else if (state == ViroConstants.TRACKING_NONE) {
      console.error(reason);
    }
  };

  const switchARScene = newScene => {
    return <ViroARSceneNavigator initialScene={{ scene: newScene }} />;
  };

  const [loaded, setLoaded] = useState(false);
  const crdsState = useSelector(state => state.coords);
  const [pltState, pltDispatch] = useThunkReducer(plotReducer, plotState);
  useEffect(() => {
    pltDispatch(getAllPlots(props.coords.lat, props.coords.long));
    setLoaded(true);
  });

  let hoeSelected = true;
  return (
    <ViroARScene
      onTrackingUpdated={onInitialized}
      anchorDetectionTypes="PlanesHorizontal"
      onAnchorFound={onAnchorFound}
    >
      <ViroParticleEmitter
        position={[0, 0, -1]}
        duration={2000}
        run={animateSeeds}
        image={{
          source: require("./res/particle_firework.png"),
          height: 0.1,
          width: 0.1
        }}
      />
      {pltState.map(plot => {
        console.log("rendering:", plot);
        return (
          <ViroBox
            onClick={(position, source) => onClick(plot)}
            height={0.05}
            width={0.05}
            length={0.05}
            position={getARCoords(plot, 0)}
            materials={getPlotButton(plot)}
          />
        );
      })}
      {anchorsFound.map(anchor => (
        <ViroBox
          onHover={onHover(anchor)}
          height={PLOT_HEIGHT}
          width={PLOT_WIDTH}
          length={PLOT_LENGTH}
          materials={["dirt"]}
          position={getARCoords(plotHere(anchor), anchor.position[1])}
        />
      ))}
      <ViroAmbientLight color="#FFFFFF" />
      {hoeSelected ? (
        <ViroARPlaneSelector
          alignment="Horizontal"
          onPlaneSelected={onSelected}
        >
          <ViroBox
            // onHover={this._onHover(anchor)}
            height={0.0001}
            width={0.8}
            length={0.8}
            materials={["dirt"]}
            position={[0, 0, 0]}
          />
        </ViroARPlaneSelector>
      ) : (
        ""
      )}
    </ViroARScene>
  );
};

var styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: "Arial",
    fontSize: 15,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center"
  }
});

ViroMaterials.createMaterials({
  dirt: {
    diffuseTexture: require("./res/plot_base.png")
  },
  waterButton: {
    diffuseColor: "#03c6fc"
  },
  seedButton: {
    diffuseColor: "#807955"
  },
  frontMaterial: {
    diffuseColor: "#FFFFFF"
  },
  backMaterial: {
    diffuseColor: "#FFFFFF"
  },
  sideMaterial: {
    diffuseColor: "#FFFFFF"
  }
});

export default ARHook;
