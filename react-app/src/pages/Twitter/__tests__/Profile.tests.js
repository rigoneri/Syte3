import React from 'react'
import { shallow } from 'enzyme'
import Profile from '../Profile'
import { mockUser } from './Twitter.tests'

it('should display a user profile', () => {
    const component = shallow(<Profile user={mockUser} />)
    expect(component.find('.banner').exists()).toEqual(true)
    expect(component.find('.picture').exists()).toEqual(true)
    expect(component.find('h2').exists()).toEqual(true)
    expect(component.find('p').exists()).toEqual(true)
    expect(component.find('.username').exists()).toEqual(true)
    expect(component.find('.stats').exists()).toEqual(true)
    expect(component.find('Photos').exists()).toEqual(true)
})

it('should not display description if user has no description', () => {
    const component = shallow(<Profile user={{ ...mockUser, description: '' }} />)
    expect(component.find('.banner').exists()).toEqual(true)
    expect(component.find('.picture').exists()).toEqual(true)
    expect(component.find('h2').exists()).toEqual(true)
    expect(component.find('p').exists()).toEqual(false)
    expect(component.find('.username').exists()).toEqual(true)
    expect(component.find('.stats').exists()).toEqual(true)
    expect(component.find('Photos').exists()).toEqual(true)
})

it('should not display pictures if user has no pictures', () => {
    const component = shallow(<Profile user={{ ...mockUser, pictures: null }} />)
    expect(component.find('.banner').exists()).toEqual(true)
    expect(component.find('.picture').exists()).toEqual(true)
    expect(component.find('h2').exists()).toEqual(true)
    expect(component.find('p').exists()).toEqual(true)
    expect(component.find('.username').exists()).toEqual(true)
    expect(component.find('.stats').exists()).toEqual(true)
    expect(component.find('Photos').exists()).toEqual(false)
})
