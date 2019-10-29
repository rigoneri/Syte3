import React from 'react'
import { shallow } from 'enzyme'
import { mockShot } from './Shots.tests'
import Modal from '../Modal'

describe('Dribbble Modal', () => {
    it('should render an dribbble shot details', () => {
        const component = shallow(<Modal item={mockShot} />)
        expect(component.find('Img[alt="Dribbble Shot"]').exists()).toEqual(true)
        expect(component.find('.details').exists()).toEqual(true)
        expect(component.find('.date').exists()).toEqual(true)
        expect(component.find('p').exists()).toEqual(true)
    })

    it('should display a date formatted from now', () => {
        let now = new Date()
        now.setDate(now.getDate() - 1)

        let component = shallow(<Modal item={{ ...mockShot, date: now.toISOString() }} />)
        expect(component.find('.date').text()).toEqual('1 day ago')

        now.setDate(now.getDate() - 30)
        component = shallow(<Modal item={{ ...mockShot, date: now.toISOString() }} />)
        expect(component.find('.date').text()).toEqual('about 1 month ago')
    })
})
