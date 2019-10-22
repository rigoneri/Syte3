export const defaultCenter = { lat: 39.1362, lng: -94.5725 }
export const defaultZoom = 9
export const mapOptions = maps => {
    return {
        maxZoom: 12,
        panControl: false,
        mapTypeControl: false,
        scrollwheel: false,
        disableDefaultUI: true,
        styles: [
            { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#162122' }, { lightness: '40' }] },
            {
                featureType: 'all',
                elementType: 'labels.text.stroke',
                stylers: [{ visibility: 'simplified' }, { color: '#162122' }, { lightness: 16 }],
            },
            { featureType: 'all', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
            {
                featureType: 'administrative',
                elementType: 'geometry.fill',
                stylers: [{ color: '#273239' }, { lightness: '52' }, { visibility: 'off' }],
            },
            {
                featureType: 'administrative',
                elementType: 'geometry.stroke',
                stylers: [{ weight: '1.00' }, { visibility: 'on' }, { lightness: '-61' }],
            },
            { featureType: 'administrative.province', elementType: 'labels.text', stylers: [{ visibility: 'simplified' }] },
            { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#273239' }, { lightness: '-18' }, { saturation: '0' }] },
            { featureType: 'landscape.natural', elementType: 'geometry.fill', stylers: [{ visibility: 'on' }] },
            { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#273239' }, { lightness: '-9' }, { visibility: 'on' }] },
            { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{ color: '#111619' }, { lightness: '5' }] },
            {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{ weight: 0.2 }, { color: '#273239' }, { lightness: '-50' }, { visibility: 'off' }],
            },
            { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#111619' }, { lightness: '6' }] },
            { featureType: 'road.arterial', elementType: 'labels.text', stylers: [{ visibility: 'off' }] },
            { featureType: 'road.local', elementType: 'geometry', stylers: [{ color: '#111619' }, { lightness: '3' }] },
            { featureType: 'road.local', elementType: 'labels.text', stylers: [{ visibility: 'off' }] },
            { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#273239' }, { lightness: '-9' }] },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#182125' }, { lightness: '-12' }, { saturation: '0' }, { gamma: '1.00' }],
            },
            { featureType: 'water', elementType: 'labels.text', stylers: [{ visibility: 'simplified' }] },
        ],
    }
}
