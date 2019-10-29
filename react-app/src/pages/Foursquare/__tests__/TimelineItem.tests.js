import React from 'react'
import { shallow } from 'enzyme'
import { mockCheckin } from './Checkin.tests'
import { TimelineItem } from '../TimelineItem'

it('should display a check-in', () => {
    const component = shallow(<TimelineItem item={mockCheckin} />)
    expect(component.find('.icon').exists()).toEqual(true)
    expect(component.find('Img').exists()).toEqual(true)
    expect(component.find('.title').exists()).toEqual(true)
    expect(component.find('.info').exists()).toEqual(true)
    expect(component.find('.category').exists()).toEqual(true)
    expect(component.find('.location').exists()).toEqual(true)
})
