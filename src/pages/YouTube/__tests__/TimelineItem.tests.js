import React from 'react'
import { shallow } from 'enzyme'
import { mockVideo } from './Video.tests'
import { TimelineItem } from '../TimelineItem'

it('should display a youtube video', () => {
    const component = shallow(<TimelineItem item={mockVideo} />)
    expect(component.find('p').exists()).toEqual(true)
    expect(component.find('a').exists()).toEqual(true)
    expect(component.find('.picture').exists()).toEqual(true)
    expect(component.find('.video').exists()).toEqual(true)
})
