import React from 'react'
import { shallow, mount } from 'enzyme'
import Video from '../Video'

export const mockVideo = {
    id: 'GLIaxlf2THA',
    date: '2017-07-13T04:53:33.000Z',
    type: 'youtube',
    title: 'Some Video',
    description: '<p>Some description</p>',
    image: 'https://i.ytimg.com/vi/GLIaxlf2THA/mqdefault.jpg',
}

describe('Video', () => {
    it('should display a video', () => {
        const component = shallow(<Video video={mockVideo} />)
        expect(component.find('a').exists()).toEqual(true)
        expect(component.find('Img').exists()).toEqual(true)
        expect(component.find('.videoLogo').exists()).toEqual(true)
        expect(component.find('.info').exists()).toEqual(true)
        expect(component.find('.title').exists()).toEqual(true)
        expect(component.find('.date').exists()).toEqual(true)
    })

    it('should display a date formatted from now', () => {
        let now = new Date()
        now.setDate(now.getDate() - 1)

        let component = shallow(<Video video={{ ...mockVideo, date: now.toISOString() }} />)
        expect(component.find('.date').text()).toEqual('1 day ago')

        now.setDate(now.getDate() - 30)
        component = shallow(<Video video={{ ...mockVideo, date: now.toISOString() }} />)
        expect(component.find('.date').text()).toEqual('about 1 month ago')
    })

    it('should show a modal when clicking on the video image', () => {
        const modalMount = global.document.createElement('div')
        modalMount.setAttribute('id', 'modal-mount')
        global.document.querySelector('body').appendChild(modalMount)

        const component = mount(<Video video={mockVideo} />)
        expect(component.find('Modal').exists()).toEqual(false)
        component.find('a').simulate('click')
        expect(component.find('Modal').exists()).toEqual(true)
        component.unmount()
    })
})
