import React from 'react'
import { shallow } from 'enzyme'
import { mockVideo } from './Video.tests'
import Modal from '../Modal'

describe('YouTube Modal', () => {
    it('should render a YouTube video details', () => {
        const component = shallow(<Modal item={mockVideo} />)
        expect(component.find('iframe').exists()).toEqual(true)
        expect(component.find('.details').exists()).toEqual(true)
        expect(component.find('h4').exists()).toEqual(true)
        expect(component.find('.date').exists()).toEqual(true)
        expect(component.find('p').exists()).toEqual(true)
    })

    it('should display a date formatted from now', () => {
        let now = new Date()
        now.setDate(now.getDate() - 1)

        let component = shallow(<Modal item={{ ...mockVideo, date: now.toISOString() }} />)
        expect(component.find('.date').text()).toEqual('1 day ago')

        now.setDate(now.getDate() - 30)
        component = shallow(<Modal item={{ ...mockVideo, date: now.toISOString() }} />)
        expect(component.find('.date').text()).toEqual('about 1 month ago')
    })
})
