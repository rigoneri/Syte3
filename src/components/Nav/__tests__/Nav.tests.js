import React from 'react'
import { shallow } from 'enzyme'
import { Nav, NavItem } from '../index'

it('should display a navigation menu', () => {
    const component = shallow(<Nav />)
    expect(component.find('nav').exists()).toEqual(true)
    expect(component.find('NavItem').exists()).toEqual(true)
    expect(component.find('.about').exists()).toEqual(true)
})

it('should open a new page when a navigation item is clicked', () => {
    const handleOpened = jest.fn()
    const component = shallow(<NavItem to="/some-page" handleClick={handleOpened} />)
    expect(component.find('Link').exists()).toEqual(true)
    component.find('Link').simulate('click')
    expect(handleOpened).toHaveBeenCalled()
})
