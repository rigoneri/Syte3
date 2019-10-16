import React from 'react'
import { shallow } from 'enzyme'
import Profile from '../Profile'
import { mockUser } from './Github.tests'

it('should display the github user', () => {
    const component = shallow(<Profile user={mockUser} />)
    expect(component.find('.profile').exists()).toEqual(true)
    expect(component.find('.picture').exists()).toEqual(true)
    expect(component.find('h2').exists()).toEqual(true)
    expect(component.find('p').exists()).toEqual(true)
    expect(component.find('.stats').exists()).toEqual(true)
})

it('should not display description if user has no description', () => {
    let user = { ...mockUser }
    delete user['description']
    const component = shallow(<Profile user={user} />)
    expect(component.find('.profile').exists()).toEqual(true)
    expect(component.find('.picture').exists()).toEqual(true)
    expect(component.find('h2').exists()).toEqual(true)
    expect(component.find('p').exists()).toEqual(false)
    expect(component.find('.stats').exists()).toEqual(true)
})
