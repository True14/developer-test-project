import React from 'react';
import { withGoogleMap, GoogleMap, Marker, withScriptjs, InfoWindow } from 'react-google-maps';
import { InfoBox } from "react-google-maps/lib/components/addons/InfoBox";
import { connect } from 'react-redux';
import { getLocation, getTracks, setMap, toggleInfo} from '../actions';
import './map.css';
class Map extends React.Component {

  componentDidMount() {
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords = pos.coords;
        this.props.dispatch(getLocation(coords))
      })
    } else
        this.props.dispatch(getTracks());
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.currentLocation !== this.props.currentLocation) {
      console.log('hello');
      this.props.dispatch(getTracks());
      this.recenterMap();
    }
  }

  recenterMap() {
    const map = this.props.map;
    const curr = this.props.currentLocation;
    if (map) {
      map.panTo({lat:curr.latitude, lng: curr.longitude})
    }
  }

  mapMoved() {
    // if (this.props.map)
    //   console.log('mapMoved: ' + JSON.stringify(this.props.map.getCenter(0)));
  }

  mapLoaded(map) {

    if (this.props.map != null)
      return;
    else if (map) {
      console.log('mapLoaded: '+JSON.stringify(map.getCenter()));
      this.props.dispatch(setMap(map))
    }
  }
  markerInfo(index) {
    console.log('whyyyy');
    this.props.dispatch(toggleInfo(index))
  }

  render() {
    const markers = this.props.markers || [];
    console.log(markers);
    let info;

    if (markers.length > 0) {
      info = markers.map((marker, index) => <Marker
          onClick={this.markerInfo.bind(this,index)}
          key={index}
          position={{lat: marker.position.latitude, lng: marker.position.longitude}}
        >
          {marker.showInfo ? (<InfoBox
            key={index}
            clasName='test'
            options={{ closeBoxurl: '', enableEventPropagation: true }}
            onCloseClick={this.markerInfo.bind(this,index)}
            >
              <div className='info-div'>
                <li>name: {marker.name}</li>
                <li>lat: {marker.position.latitude}</li>
                <li>lng: {marker.position.longitude}</li>
                <li>callsign: {marker.callsign}</li>
                <li>mmsid: {marker.mmsid}</li>
                <li>speed: {marker.speed}</li>
                <li>course: {marker.course}</li>
                <li>heading: {marker.heading}</li>
              </div>
            </InfoBox>):null}
        </Marker>
      )
    }
    return <GoogleMap
        ref={this.mapLoaded.bind(this)}
        onDragEnd={this.mapMoved.bind(this)}
        defaultZoom={6}
        defaultCenter={{lat: this.props.lat, lng: this.props.lng}}
      >
        {info}
      </GoogleMap>
  }
}

const mapStateToProps = state => ({
  markers: state.markers,
  map: state.map,
  currentLocation: state.currentLocation,
  lat: state.currentLocation.latitude,
  lng: state.currentLocation.longitude
})
export default connect(mapStateToProps)(withScriptjs(withGoogleMap(Map)));
