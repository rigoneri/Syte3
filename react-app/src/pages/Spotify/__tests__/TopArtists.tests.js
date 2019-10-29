import React from 'react'
import { shallow } from 'enzyme'
import { mockArtist } from './Top.tests'
import TopArtists from '../TopArtists'

it('should display a list of artists', () => {
    const artists = [mockArtist, { ...mockArtist, id: `${mockArtist}-2` }]
    const component = shallow(<TopArtists artists={artists} />)
    expect(component.find('h3').exists()).toEqual(true)
    expect(component.find('ul').exists()).toEqual(true)
    expect(component.find('a').exists()).toEqual(true)
    expect(component.find('.name').exists()).toEqual(true)
    expect(component.find('.genre').exists()).toEqual(true)
})

it('should display not display genres if there are none', () => {
    const artists = [{ ...mockArtist, genres: [] }]
    const component = shallow(<TopArtists artists={artists} />)
    expect(component.find('h3').exists()).toEqual(true)
    expect(component.find('ul').exists()).toEqual(true)
    expect(component.find('a').exists()).toEqual(true)
    expect(component.find('.name').exists()).toEqual(true)
    expect(component.find('.genre').exists()).toEqual(false)
})
