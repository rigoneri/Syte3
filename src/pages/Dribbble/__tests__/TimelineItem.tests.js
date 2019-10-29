import React from 'react'
import { shallow, mount } from 'enzyme'
import { mockShot } from './Shots.tests'
import { TimelineItem } from '../TimelineItem'

it('should display an dribbble shot', () => {
    const component = shallow(<TimelineItem item={mockShot} />)
    expect(component.find('p').exists()).toEqual(true)
    expect(component.find('a').exists()).toEqual(true)
    expect(component.find('.picture').exists()).toEqual(true)
})

it('should show a modal when clicking the dribbble shot', () => {
    const modalMount = global.document.createElement('div')
    modalMount.setAttribute('id', 'modal-mount')
    global.document.querySelector('body').appendChild(modalMount)

    let component = mount(<TimelineItem item={mockShot} />)

    expect(component.find('Modal').exists()).toEqual(false)
    component.find('.picture').simulate('click')
    expect(component.find('Modal').exists()).toEqual(true)

    component.unmount()
})
