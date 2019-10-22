import React from 'react'
import GoogleMapReact from 'google-map-react'
import { defaultCenter, defaultZoom, mapOptions } from './MapOptions'
import styles from './Foursquare.module.css'

const Marker = ({ $hover, title }) => {
    return (
        <div className={`${styles.marker} ${$hover ? styles.hover : null}`}>
            <span>{title}</span>
        </div>
    )
}

export default function Map({ markers }) {
    const googleApiLoaded = (map, maps, markers) => {
        const bounds = new maps.LatLngBounds()
        markers.forEach(marker => {
            bounds.extend(new maps.LatLng(marker.lat, marker.lng))
        })
        map.fitBounds(bounds)
    }

    return (
        <div style={{ height: '300px', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_KEY }}
                defaultCenter={defaultCenter}
                defaultZoom={defaultZoom}
                options={mapOptions}
                hoverDistance={10}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) => googleApiLoaded(map, maps, markers)}>
                {markers && markers.map(marker => <Marker key={marker.id} lat={marker.lat} lng={marker.lng} title={marker.title} />)}
            </GoogleMapReact>
        </div>
    )
}
