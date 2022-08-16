import React, { useEffect, useState } from 'react';
import Map, { LngLat, Marker, NavigationControl, Popup } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import Header from './components/Header';
import './App.css'
import './Header.css'
import ReactMapGl from 'react-map-gl'
import Axios from 'axios'
 
function App() {
  
  const [listOfIncidents, setListOfIncidents] = useState<any[]>([])
  
  const [selectedIncident, setSelectedIncident] = useState({
    incidentName: '',
    severity: 0,
    lat: 0,
    lng: 0,
    imageURL: ''
  })

  const [viewState, setViewState] = useState({})

  const error = () => {
   console.log('unable to find location');
  }

  const success = (position) => {
  
    const latcoord = position.coords.latitude;
    const lngcoord = position.coords.longitude;

    setViewState({
      longitude: lngcoord,
      latitude: latcoord,
      zoom: 12
    })
  
    return [latcoord, lngcoord]
  }


  useEffect(() => {
    const currentLocation = () => {
      navigator.geolocation.getCurrentPosition(success, error, {enableHighAccuracy: true})
    }

    currentLocation()

    Axios.get(`https://www.mapquestapi.com/traffic/v2/incidents?key=${process.env.REACT_APP_MAPBOX_KEY}&boundingBox=36.80543,-121.3924,38.9554,-123.9422&filters=construction,incidents/incidents`)
      .then(async (response) => {
        await response.data.incidents.map((incident) => {
          Axios.post('http://localhost:3001/createIncident', {
            incidentName: incident.fullDesc,
            lng: incident.lng,
            lat: incident.lat,
            severity: incident.severity,
            imageURL: incident.iconURL
          })
            
          console.log(incident)
        })
      })
    
    Axios.get('http://localhost:3001/getIncidents')
      .then(async (response) => {
        await setListOfIncidents(response.data)
      })

  }, [])

  // const showPopup = (current) => {
  //   listOfIncidents.map((incident) => {
  //     if (incident === current) {
  //       return
  //         <div>
  //           <Popup>

  //           </Popup> 
  //         </div>
  //       ;
  //     }
  //   })
  // }

  return (
    
    <div className="App">
      <Header />
      <ReactMapGl
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          style={{
            width: '100%', 
            height: '95vh',
          }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          initialViewState={viewState}
        >

        <NavigationControl />
        
        {listOfIncidents.map((incident) => (
          <div key={incident.incidentName}>
            <Marker
              latitude={incident.lat}
              longitude={incident.lng}
              
            >
              <button className='markerButtons' onClick={e => {
                e.preventDefault()
                setSelectedIncident(incident);
                <Popup
                  longitude={selectedIncident.lng}
                  latitude={selectedIncident.lat}
                >

                </Popup>
              }}
              >
            
                <div>
                  <p>⚠️</p>
                </div>
              </button>
              
            </Marker>
          </div>
        ))}
        
        

      {selectedIncident ? (
         <Popup 
         longitude={selectedIncident.lng} 
         latitude={selectedIncident.lat}
         onClose={() => setSelectedIncident({
          incidentName: '',
          severity: 0,
          lat: 0,
          lng: 0,
          imageURL: ''
         })}
         >
            <div>
              <p>{selectedIncident.incidentName}</p>
              <p>Severity: {selectedIncident.severity}</p>
            </div>
          </Popup>
       ) : null}

        </ReactMapGl>

    </div>
  );
}

export default App;
