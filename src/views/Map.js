import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";

import PageTitle from "./../components/common/PageTitle";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";

import "./Map.css"
import 'leaflet/dist/leaflet.css';

const position = [51.505, -0.09]

// https://api.gbif.org/v2/map/debug/ol/

const makeUrl = (taxonKey) => {
  return `https://api.gbif.org/v2/map/occurrence/density/{z}/{x}/{y}@2x.png?srs=EPSG:3857&bin=hex&hexPerTile=50&year=1961,2020&taxonKey=${taxonKey}&style=classic.poly`
}


const MapView = ({nodeFocus,G}) => {

  const [taxonKey,setTaxonKey] = React.useState(1)


  React.useEffect(() => {
    if (nodeFocus !== ""){
      let {rank,rankColor,key} = G.getFromName(nodeFocus)
      setTaxonKey(key)
    }
  }, [nodeFocus])


  // console.log(taxonKey)

  return (
    <Row>
    <MapContainer center={[51.505, -0.09]} zoom={1.5} scrollWheelZoom={true}>
      <TileLayer
        // attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        url="https://tile.gbif.org/3857/omt/{z}/{x}/{y}@2x.png?style=gbif-tuatara"
      />
      <TileLayer key={taxonKey} url={makeUrl(taxonKey)}/>
    </MapContainer>
    </Row>
)};

export default MapView;
