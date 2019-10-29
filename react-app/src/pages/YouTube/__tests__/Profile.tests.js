import React from 'react'
import { shallow } from 'enzyme'
import Profile from '../Profile'
import { mockUser } from './YouTube.tests'

it('should display the youtube user', () => {
    const component = shallow(<Profile user={mockUser} />)
    expect(component.find('.profile').exists()).toEqual(true)
    expect(component.find('.banner').exists()).toEqual(true)
    expect(component.find('.picture').exists()).toEqual(true)
    expect(component.find('h2').exists()).toEqual(true)
    expect(component.find('.stats').exists()).toEqual(true)
})
