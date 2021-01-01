export const defaultCenter = { lat: 39.1362, lng: -94.5725 }
export const defaultZoom = 9

const cssVariable = (elm: HTMLHtmlElement, variable: string): string => {
    let color = window
        .getComputedStyle(elm)
        .getPropertyValue(`--${variable}`)
        .trim()
    return color.length === 4 ? color + color.substring(1) : color
}

export const mapOptions = () => {
    const elm = document.getElementsByTagName('html')[0]
    const textColor = cssVariable(elm, 'alt-text-color')
    const backgroundColor = cssVariable(elm, 'background-color')
    const backgroundColorDark = cssVariable(elm, 'background-color-dark')
    const lineColor = cssVariable(elm, 'line-color')

    return {
        maxZoom: 12,
        panControl: false,
        mapTypeControl: false,
        disableDefaultUI: true,
        styles: [
            { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: textColor }] },
            {
                featureType: 'all',
                elementType: 'labels.text.stroke',
                stylers: [{ visibility: 'simplified' }, { color: textColor }, { lightness: 16 }],
            },
            { featureType: 'all', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
            {
                featureType: 'administrative',
                elementType: 'geometry.fill',
                stylers: [{ color: backgroundColor }, { lightness: '52' }, { visibility: 'off' }],
            },
            {
                featureType: 'administrative',
                elementType: 'geometry.stroke',
                stylers: [{ color: lineColor }, { weight: '1.00' }, { visibility: 'on' }],
            },
            {
                featureType: 'administrative.province',
                elementType: 'labels.text',
                stylers: [{ visibility: 'simplified' }],
            },
            { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: backgroundColor }] },
            { featureType: 'landscape.natural', elementType: 'geometry.fill', stylers: [{ visibility: 'on' }] },
            {
                featureType: 'poi',
                elementType: 'geometry',
                stylers: [{ color: backgroundColor }, { lightness: '-9' }, { visibility: 'off' }],
            },
            { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{ color: lineColor }] },
            {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{ weight: 0.2 }, { color: backgroundColor }, { lightness: '-50' }, { visibility: 'off' }],
            },
            {
                featureType: 'road.arterial',
                elementType: 'geometry',
                stylers: [{ color: lineColor }, { lightness: '6' }],
            },
            { featureType: 'road.arterial', elementType: 'labels.text', stylers: [{ visibility: 'off' }] },
            { featureType: 'road.local', elementType: 'geometry', stylers: [{ color: lineColor }, { lightness: '3' }] },
            { featureType: 'road.local', elementType: 'labels.text', stylers: [{ visibility: 'off' }] },
            {
                featureType: 'transit',
                elementType: 'geometry',
                stylers: [{ color: backgroundColor }, { lightness: '-9' }],
            },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: backgroundColorDark }, { lightness: '-12' }, { saturation: '0' }, { gamma: '1.00' }],
            },
            { featureType: 'water', elementType: 'labels.text', stylers: [{ visibility: 'simplified' }] },
        ],
    }
}
