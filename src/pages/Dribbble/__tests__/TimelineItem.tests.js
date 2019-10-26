import React from 'react'
import { shallow } from 'enzyme'
import { mockShot } from './Shots.tests'
import { TimelineItem } from '../TimelineItem'

it('should display an dribbble shot', () => {
    const component = shallow(<TimelineItem item={mockShot} />)
    expect(component.find('p').exists()).toEqual(true)
    expect(component.find('a').exists()).toEqual(true)
    expect(component.find('.picture').exists()).toEqual(true)
})
