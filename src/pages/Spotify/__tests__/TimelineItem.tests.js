import React from 'react'
import { shallow } from 'enzyme'
import { TimelineItem } from '../TimelineItem'

const mockItem = {
    _id: '5db34a25376931c78a6c1a50',
    day: '2019-10-25',
    date: '2019-10-26T04:59:00.000Z',
    type: 'spotify',
    plays: 24,
    tracks: [
        {
            title: 'In This Love',
            artist: 'Stick Figure',
            image: 'https://i.scdn.co/image/ab67616d00004851655dfb391e8f4de54f87ab07',
            url: 'https://open.spotify.com/track/3u1bKblfqeghD3grk3Le2w',
        },
        {
            title: 'Morning',
            artist: 'SOJA',
            image: 'https://i.scdn.co/image/ab67616d00001e029cc579fea22ae1a46b4b76e8',
            url: 'https://open.spotify.com/track/7kMLiooQZZrAOeruVRr9AJ',
        },
    ],
}

it('should display a list of played tracks', () => {
    const component = shallow(<TimelineItem item={mockItem} />)
    expect(component.find(`a[href="${mockItem.tracks[0].url}"]`).exists()).toEqual(true)
    expect(component.find('p').text()).toEqual('Listened to In This Love by Stick Figure and 23 other tracks on Spotify.')
    expect(component.find(`ul`).exists()).toEqual(true)
    expect(component.find(`Img`).exists()).toEqual(true)
})

it('should display a single track', () => {
    const singleTrackItem = { ...mockItem }
    singleTrackItem.plays = 1
    singleTrackItem.tracks = [mockItem.tracks[0]]

    const component = shallow(<TimelineItem item={singleTrackItem} />)
    expect(component.find(`a[href="${mockItem.tracks[0].url}"]`).exists()).toEqual(true)
    expect(component.find('p').text()).toEqual('Listened to In This Love by Stick Figure on Spotify.')
    expect(component.find(`ul`).exists()).toEqual(true)
    expect(component.find(`Img`).exists()).toEqual(true)
})

it('should display total played with no tracks', () => {
    const noTracksItem = { ...mockItem }
    noTracksItem.tracks = []

    const component = shallow(<TimelineItem item={noTracksItem} />)
    expect(component.find(`a[href="${mockItem.tracks[0].url}"]`).exists()).toEqual(false)
    expect(component.find('p').text()).toEqual('Listened to 24 tracks on Spotify.')
    expect(component.find(`ul`).exists()).toEqual(false)
    expect(component.find(`Img`).exists()).toEqual(false)
})

it('should display a single play with no tracks', () => {
    const noTracksItem = { ...mockItem }
    noTracksItem.plays = 1
    noTracksItem.tracks = []

    const component = shallow(<TimelineItem item={noTracksItem} />)
    expect(component.find(`a[href="${mockItem.tracks[0].url}"]`).exists()).toEqual(false)
    expect(component.find('p').text()).toEqual('Listened to 1 track on Spotify.')
    expect(component.find(`ul`).exists()).toEqual(false)
    expect(component.find(`Img`).exists()).toEqual(false)
})
