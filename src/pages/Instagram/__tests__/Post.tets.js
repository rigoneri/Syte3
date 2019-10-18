import React from 'react'
import { shallow } from 'enzyme'
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
})
