import React from "react";
import MapView, { PROVIDER_GOOGLE, PROVIDER_DEFAULT } from "react-native-maps";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
const initialRegion = {
  latitude: -37.32,
  longitude: -59.13,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function App() {
  const map = React.useRef();
  const [region, setRegion] = React.useState(initialRegion);
  const [searchText, setSearchText] = React.useState("");
  const [places, setPlaces] = React.useState([]);
  const searchPlace = () => {
    if (!searchText.trim().length) return;
    const googleApisUrl =
      "https://maps.googleapis.com/maps/api/place/textsearch/json";
    const input = searchText.trim();
    const location = `${(region.latitude, region.longitude)}&radius=2500`;
    const url = `${googleApisUrl}?query=${input}&${location}&key=AIzaSyDaXlAMBaEplUlHsEGtVMs1flnU2EyV8Ts`;

    fetch(url)
      .then(res => res.json())
      .then(places => {
        if (places && places.results) {
          const coords = [];
          for (const place of places.results) {
            coords.push({
              latitude: place.geometry.location.lat,
              longitude: place.geometry.location.lng,
            });
          }
        }
        setPlaces(places.results);
        if (coords.length) {
          map.current?.fitToCoordinates(coords, {
            edgePadding: {
              top: 50,
              right: 50,
              bottom: 50,
              left: 50,
            },
            animated: true,
          });
          Keyboard.dismiss();
        }
      });
  };
  return (
    <View style={styles.container}>
      <MapView
        ref={map}
        style={StyleSheet.absoluteFillObject}
        // provider={PROVIDER_DEFAULT}
        // initialRegion={region}
        region={region}
        showsMyLocationButton={true} //Nico sapeeeee
        onRegionChangeComplete={r => setRegion(r)}
      />
      <View>
        <TextInput
          placeholder="Search for a place..."
          onChangeText={setSearchText}
          autoCapitalize="characters"
        />
        <TouchableOpacity onPress={searchPlace}>
          <Text>GO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 45,
    flex: 1,
  },
  coordsContainer: {
    alignItems: "center",
    width: 150,
    position: "absolute",
    bottom: 10,
    left: "50%", // Center horizontally
    marginLeft: -75, // Adjust based on the half of your container width
    backgroundColor: "rgba(255, 105, 180, 0.581)",
    padding: 10,
    borderRadius: 10,
  },
  searchContainer: {
    position: "absolute",
    width: 260,
    top: 10,
    alignSelf: "center",
    alignItems: "center",
    left: "50%", // Center horizontally
    marginLeft: -130, // Adjust based on the half of your container width
    backgroundColor: "rgba(255, 105, 180, 0.581)",
    paddingVertical: 10,
    borderRadius: 10,
  },
  searchInput: {
    color: "black",
    backgroundColor: "white",
    width: "90%",
    borderRadius: 10,
    height: 35,
    paddingHorizontal: 5,
  },
  btnSearch: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    backgroundColor: "white",
    borderRadius: 10,
    height: 35,
  },
  btnText: {
    fontSize: 20,
    fontWeight: "800",
  },
});
