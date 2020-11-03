import React from 'react'
import { shallow, mount } from 'enzyme'
import { Nav, NavItem } from '../index'
import { MemoryRouter } from 'react-router-dom'

it('should display a navigation menu', () => {
    const component = shallow(<Nav />)
    expect(component.find('nav').exists()).toEqual(true)
    expect(component.find('NavItem').exists()).toEqual(true)
    expect(component.find('.about').exists()).toEqual(true)
})

it('should open a new page when a navigation item is clicked', () => {
    const handleOpened = jest.fn()
    const component = mount(
        <MemoryRouter>
            <NavItem to="/some-page" handleClick={handleOpened} />
        </MemoryRouter>
    )
    expect(component.find('NavLink').exists()).toEqual(true)
    component.find('NavLink').simulate('click')
    expect(handleOpened).toHaveBeenCalled()
})
