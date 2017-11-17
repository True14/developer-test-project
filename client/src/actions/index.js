export const GET_LOCATION = 'GET_LOCATION';
export const getLocation = (coord) => ({
  type: GET_LOCATION,
  coord
});

export const GET_TRACKS_SUCCESS = 'GET_TRACKS_SUCCESS';
export const getTracksSuccess = tracks => ({
  type: GET_TRACKS_SUCCESS,
  tracks
});

export const SET_MAP = 'SET_MAP';
export const setMap = map => ({
  type: SET_MAP,
  map
});

export const TOGGLE_INFO = 'TOGGLE_INFO';
export const toggleInfo = index => ({
  type: TOGGLE_INFO,
  index
});

export const getTracks =() => dispatch => {
  return fetch('/api/tracks', {
    method: 'GET'
  })
  .then(res => {
    if (!res.ok) {
      throw new Error(res.statusText)
    }
    return res.json();
  })
  .then(res => {
    dispatch(getTracksSuccess(res));
  })
  .catch(err => console.log('Error'))
}
