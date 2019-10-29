import React from 'react'
import { shallow } from 'enzyme'
import Profile from '../Profile'
import { mockUser } from './Foursquare.tests'

it('should display the foursquare user', () => {
    const component = shallow(<Profile user={mockUser} />)
    expect(component.find('.profile').exists()).toEqual(true)
    expect(component.find('.picture').exists()).toEqual(true)
    expect(component.find('h2').exists()).toEqual(true)
    expect(component.find('.location').exists()).toEqual(true)
    expect(component.find('.stats').exists()).toEqual(true)
})
