import React from 'react'
import { shallow, mount } from 'enzyme'
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

it('should show a modal when clicking the instagram post', () => {
    const modalMount = global.document.createElement('div')
    modalMount.setAttribute('id', 'modal-mount')
    global.document.querySelector('body').appendChild(modalMount)

    const post = { ...mockPost, video: null }
    const component = mount(<TimelineItem item={post} />)
    expect(component.find('Modal').exists()).toEqual(false)
    component.find('a').simulate('click')
    expect(component.find('Modal').exists()).toEqual(true)
    component.unmount()
})
