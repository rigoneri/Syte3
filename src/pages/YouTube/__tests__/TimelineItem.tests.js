import React from 'react'
import { shallow, mount } from 'enzyme'
import { mockVideo } from './Video.tests'
import { TimelineItem } from '../TimelineItem'

it('should display a youtube video', () => {
    const component = shallow(<TimelineItem item={mockVideo} />)
    expect(component.find('p').exists()).toEqual(true)
    expect(component.find('a').exists()).toEqual(true)
    expect(component.find('.picture').exists()).toEqual(true)
    expect(component.find('.video').exists()).toEqual(true)
})

it('should show a modal when clicking on the video image', () => {
    const modalMount = global.document.createElement('div')
    modalMount.setAttribute('id', 'modal-mount')
    global.document.querySelector('body').appendChild(modalMount)

    const component = mount(<TimelineItem item={mockVideo} />)
    expect(component.find('Modal').exists()).toEqual(false)
    component.find('a').simulate('click')
    expect(component.find('Modal').exists()).toEqual(true)
    component.unmount()
})
