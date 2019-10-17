import React from 'react'
import { shallow } from 'enzyme'
import Header from '../index'

it('should display a header with a nav', () => {
    const component = shallow(<Header />)
    expect(component.find('header').exists()).toEqual(true)
    expect(component.find('.picture').exists()).toEqual(true)
    expect(component.find('Nav').exists()).toEqual(true)
})
