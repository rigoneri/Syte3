import React from 'react'
import { shallow, mount } from 'enzyme'
import { mockPost } from './Posts.tests'
import Post from '../Post'

describe('Post', () => {
    it('should display an instagram image', () => {
        const post = { ...mockPost, video: null }
        const component = shallow(<Post post={post} />)
        expect(component.find('a').exists()).toEqual(true)
        expect(component.find('Img[alt="Instagram Post"]').exists()).toEqual(true)
        expect(component.find('.video').exists()).toEqual(false)
    })

    it('should display an instagram video', () => {
        const component = shallow(<Post post={mockPost} />)
        expect(component.find('a').exists()).toEqual(true)
        expect(component.find('Img[alt="Instagram Post"]').exists()).toEqual(true)
        expect(component.find('.video').exists()).toEqual(true)
    })

    it('should display stats about the post', () => {
        const component = shallow(<Post post={mockPost} />)
        expect(component.find('a').exists()).toEqual(true)
        expect(component.find('Img[alt="Instagram Post"]').exists()).toEqual(true)
        expect(component.find('.stats').exists()).toEqual(true)
    })

    it('should show a modal when clicking the instagram post', () => {
        const modalMount = global.document.createElement('div')
        modalMount.setAttribute('id', 'modal-mount')
        global.document.querySelector('body').appendChild(modalMount)

        const post = { ...mockPost, video: null }
        const component = mount(<Post post={post} />)
        expect(component.find('Modal').exists()).toEqual(false)
        component.find('a').simulate('click')
        expect(component.find('Modal').exists()).toEqual(true)
        component.unmount()
    })
})
