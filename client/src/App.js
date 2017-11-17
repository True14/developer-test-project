import React, { Component } from 'react';
import './App.css';
import Map from './components/map';
const { API_KEY } = require('./config.js');
class App extends Component {
  render() {

    return (
      <div className="App">
        <Map
        googleMapURL= {"https://maps.googleapis.com/maps/api/js?key="+ API_KEY +"&v=3.exp&libraries=geometry,drawing,places"}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100vh` }} />}
        mapElement={<div style={{ height: `100%` }} />} />
      </div>
    );
  }
}

export default App;
