import React from 'react'
import { shallow, mount } from 'enzyme'
import { mockTrack } from './RecentTracks.tests'
import TopTracks from '../TopTracks'

it('should display a list of tracks', () => {
    const tracks = [mockTrack, { ...mockTrack, id: `${mockTrack}-2` }]
    const component = shallow(<TopTracks tracks={tracks} />)
    expect(component.find('h3').exists()).toEqual(true)
    expect(component.find('ul').exists()).toEqual(true)
    expect(component.find('a').exists()).toEqual(true)
    expect(component.find('.playIcon').exists()).toEqual(true)
    expect(component.find('.playing').exists()).toEqual(false)
    expect(component.find('.name').exists()).toEqual(true)
    expect(component.find('.artist').exists()).toEqual(true)
})

it('should play an audio when playIcon is clicked', async () => {
    const tracks = [mockTrack]
    const onPlayTrack = jest.fn()
    const component = mount(<TopTracks tracks={tracks} playing={mockTrack.id} onPlayTrack={onPlayTrack} />)
    expect(component.find('.playIcon').exists()).toEqual(true)
    await component.find('.playIcon').simulate('click')
    expect(onPlayTrack).toHaveBeenCalled()
})

it('should display a track playing', () => {
    const tracks = [mockTrack, { ...mockTrack, id: `${mockTrack}-2` }]
    const component = shallow(<TopTracks tracks={tracks} playing={mockTrack.id} />)
    expect(component.find('h3').exists()).toEqual(true)
    expect(component.find('ul').exists()).toEqual(true)
    expect(component.find('a').exists()).toEqual(true)
    expect(component.find('.playIcon').exists()).toEqual(true)
    expect(component.find('.playing').exists()).toEqual(true)
    expect(component.find('.name').exists()).toEqual(true)
    expect(component.find('.artist').exists()).toEqual(true)
})
