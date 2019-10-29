import React from 'react'
import { shallow, mount } from 'enzyme'
import { mockTweet } from './Tweet.tests'
import Modal from '../Modal'

describe('Twitter Modal', () => {
    it('should render an tweet details', () => {
        const component = shallow(<Modal item={mockTweet} />)
        expect(component.find('.details').exists()).toEqual(true)
        expect(component.find('h4').exists()).toEqual(true)
        expect(component.find('Img[alt="Avatar"]').exists()).toEqual(true)
        expect(component.find('.date').exists()).toEqual(true)
        expect(component.find('.stats').exists()).toEqual(true)
        expect(component.find('p').exists()).toEqual(true)
    })

    it('should display a date formatted from now', () => {
        let now = new Date()
        now.setDate(now.getDate() - 1)

        let component = shallow(<Modal item={{ ...mockTweet, date: now.toISOString() }} />)
        expect(component.find('.date').text()).toEqual('1 day ago')

        now.setDate(now.getDate() - 30)
        component = shallow(<Modal item={{ ...mockTweet, date: now.toISOString() }} />)
        expect(component.find('.date').text()).toEqual('about 1 month ago')
    })

    it('should display videos', () => {
        const post = { ...mockTweet }
        const component = shallow(<Modal item={post} />)
        expect(component.find('video').exists()).toEqual(true)
        expect(component.find('Img[alt="Twitter Picture"]').exists()).toEqual(false)
    })

    it('should display a single picture', () => {
        const modalMount = global.document.createElement('div')
        modalMount.setAttribute('id', 'modal-mount')
        global.document.querySelector('body').appendChild(modalMount)

        const post = { ...mockTweet, video: null }
        const component = mount(<Modal item={post} />)
        expect(component.find('video').exists()).toEqual(false)
        expect(component.find('Img[alt="Twitter Picture"]').exists()).toEqual(true)
        expect(component.find('.leftIcon').exists()).toEqual(false)
        expect(component.find('.rightIcon').exists()).toEqual(false)
    })

    it('should be able to navigate multiple pictures', () => {
        const modalMount = global.document.createElement('div')
        modalMount.setAttribute('id', 'modal-mount')
        global.document.querySelector('body').appendChild(modalMount)

        let pictures = mockTweet.pictures
        pictures.push({
            id: 'pic-2',
            url: 'https://pbs.twimg.com/test-pic-2.jpg',
            width: 360,
            height: 360,
        })

        const post = { ...mockTweet, video: null, pictures }
        const component = mount(<Modal item={post} />)
        expect(component.find(`Img[src="${pictures[0].url}"]`).exists()).toEqual(true)
        expect(component.find('.video').exists()).toEqual(false)
        expect(component.find('.leftIcon').exists()).toEqual(true)
        expect(component.find('.rightIcon').exists()).toEqual(true)

        component.find('.rightIcon').simulate('click')
        expect(component.find(`Img[src="${pictures[0].url}"]`).exists()).toEqual(false)
        expect(component.find(`Img[src="${pictures[1].url}"]`).exists()).toEqual(true)

        component.find('.rightIcon').simulate('click')
        expect(component.find(`Img[src="${pictures[1].url}"]`).exists()).toEqual(false)
        expect(component.find(`Img[src="${pictures[0].url}"]`).exists()).toEqual(true)

        component.find('.rightIcon').simulate('click')
        expect(component.find(`Img[src="${pictures[0].url}"]`).exists()).toEqual(false)
        expect(component.find(`Img[src="${pictures[1].url}"]`).exists()).toEqual(true)

        component.find('.leftIcon').simulate('click')
        expect(component.find(`Img[src="${pictures[1].url}"]`).exists()).toEqual(false)
        expect(component.find(`Img[src="${pictures[0].url}"]`).exists()).toEqual(true)

        component.find('.leftIcon').simulate('click')
        expect(component.find(`Img[src="${pictures[0].url}"]`).exists()).toEqual(false)
        expect(component.find(`Img[src="${pictures[1].url}"]`).exists()).toEqual(true)
    })
})
