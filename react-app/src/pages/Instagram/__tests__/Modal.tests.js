import React from 'react'
import { shallow } from 'enzyme'
import { mockPost } from './Posts.tests'
import Modal from '../Modal'

describe('Instagram Modal', () => {
    it('should render an instagram post details', () => {
        const component = shallow(<Modal item={mockPost} />)
        expect(component.find('video').exists()).toEqual(true)
        expect(component.find('.details').exists()).toEqual(true)
        expect(component.find('p').exists()).toEqual(true)
    })

    it('should display a date formatted from now', () => {
        let now = new Date()
        now.setDate(now.getDate() - 1)

        let component = shallow(<Modal item={{ ...mockPost, date: now.toISOString() }} />)
        expect(component.find('.date').text()).toEqual('1 day ago')

        now.setDate(now.getDate() - 30)
        component = shallow(<Modal item={{ ...mockPost, date: now.toISOString() }} />)
        expect(component.find('.date').text()).toEqual('about 1 month ago')
    })

    it('should display an instagram image', () => {
        const post = { ...mockPost, video: null }
        const component = shallow(<Modal item={post} />)
        expect(component.find('Img[alt="Instagram Post"]').exists()).toEqual(true)
        expect(component.find('.video').exists()).toEqual(false)
    })
})
