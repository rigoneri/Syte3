import React from 'react'
import { shallow } from 'enzyme'
import Profile from '../Profile'
import { mockUser } from './Dribbble.tests'

it('should display the dribbble user', () => {
    const component = shallow(<Profile user={mockUser} />)
    expect(component.find('.profile').exists()).toEqual(true)
    expect(component.find('.picture').exists()).toEqual(true)
    expect(component.find('h2').exists()).toEqual(true)
    expect(component.find('.username').exists()).toEqual(true)
    expect(component.find('p').exists()).toEqual(true)
    expect(component.find('.stats').exists()).toEqual(true)
})

it('should not display bio if the user has no bio', () => {
    let user = { ...mockUser }
    delete user['bio']
    const component = shallow(<Profile user={user} />)
    expect(component.find('.profile').exists()).toEqual(true)
    expect(component.find('.picture').exists()).toEqual(true)
    expect(component.find('h2').exists()).toEqual(true)
    expect(component.find('p').exists()).toEqual(false)
    expect(component.find('.stats').exists()).toEqual(true)
})
