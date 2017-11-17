const initialState = {
  map: null,
  markers: [],
  currentLocation: {
    latitude: 23.234,
    longitude: -87.234
  },
  activeMarker: {},
  showingInfoWindow: false,
  selectedPlace: {}
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_LOCATION':
      return {
        ...state,
        currentLocation: action.coord
      }
    case 'GET_TRACKS_SUCCESS':
      let markers = action.tracks.slice();
      markers.forEach(marker => {
        marker.showInfo = false;
      });
      return {
        ...state,
        markers
      }
    case 'SET_MAP':
      return {
        ...state,
        map: action.map
      }
    case 'TOGGLE_INFO':
      markers = state.markers.slice();
      console.log(action.index);
      // markers.forEach(marker => {
      //   marker.showInfo = !marker.showInfo;
      // })
      markers[action.index].showInfo = !markers[action.index].showInfo;
      console.log('markers after toggle', markers);
      return {
        ...state,
        markers: markers
      }
    default:
      return state;
  }

}

export default reducer
