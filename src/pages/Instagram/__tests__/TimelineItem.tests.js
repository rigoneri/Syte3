import React from 'react'
import { shallow } from 'enzyme'
import { mockPost } from './Posts.tests'
import { TimelineItem } from '../TimelineItem'

it('should display an instagram image', () => {
    const post = { ...mockPost, video: null }
    const component = shallow(<TimelineItem item={post} />)
    expect(component.find('p').exists()).toEqual(true)
    expect(component.find('a').exists()).toEqual(true)
    expect(component.find('.picture').exists()).toEqual(true)
    expect(component.find('.video').exists()).toEqual(false)
})

it('should display an instagram post with video', () => {
    const component = shallow(<TimelineItem item={mockPost} />)
    expect(component.find('p').exists()).toEqual(true)
    expect(component.find('a').exists()).toEqual(true)
    expect(component.find('.picture').exists()).toEqual(true)
    expect(component.find('.video').exists()).toEqual(true)
})
