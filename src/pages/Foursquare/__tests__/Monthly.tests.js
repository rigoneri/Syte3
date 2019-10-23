import React from 'react'
import { shallow, mount } from 'enzyme'
import { mockCheckin } from './Checkin.tests'
import Monthly from '../Monthly'

describe('Monthly', () => {
    jest.mock('../Map', () => {
        return {
            __esModule: true,
            default: () => {
                return <div />
            },
        }
    })

    it('should display monthly check-ins and a map', () => {
        let component = mount(<Monthly checkins={[mockCheckin]} month={0} onMonthChange={jest.fn} />)
        expect(component.find('header').exists()).toEqual(true)
        expect(component.find('Map').exists()).toEqual(true)
        expect(component.find('.categories').exists()).toEqual(true)
        expect(component.find('.category').exists()).toEqual(true)
        expect(component.find('.icon').exists()).toEqual(true)
        expect(component.find('.count').exists()).toEqual(true)
    })

    it('should display check-ins grouped by category sorted by count descending', () => {
        let checkins = [
            { ...mockCheckin, category: 'First Category' },
            { ...mockCheckin, id: '4567', category: 'Second Category' },
            { ...mockCheckin, id: '1234', category: 'First Category' },
        ]

        let component = mount(<Monthly checkins={checkins} month={0} onMonthChange={jest.fn} />)
        expect(component.find('.categories').exists()).toEqual(true)
        expect(component.find('.categories').find('li').length).toEqual(2)
        expect(
            component
                .find('.categories')
                .find('li')
                .first()
                .find('.category')
                .text()
        ).toEqual('First Category')
        expect(
            component
                .find('.categories')
                .find('li')
                .first()
                .find('.count')
                .text()
        ).toEqual('2 times')
        expect(
            component
                .find('.categories')
                .find('li')
                .last()
                .find('.category')
                .text()
        ).toEqual('Second Category')
        expect(
            component
                .find('.categories')
                .find('li')
                .last()
                .find('.count')
                .text()
        ).toEqual('1 time')
    })

    it('should display previous icon and no next icon if current month', () => {
        let component = shallow(<Monthly checkins={[mockCheckin]} month={0} onMonthChange={jest.fn} />)
        expect(component.find('header').exists()).toEqual(true)
        expect(component.find('.leftIcon').exists()).toEqual(true)
        expect(component.find('.rightIcon').exists()).toEqual(false)
    })

    it('should change months when clicking the previous icon', async () => {
        let onMonthChange = jest.fn()
        let component = mount(<Monthly checkins={[mockCheckin]} month={0} onMonthChange={onMonthChange} />)
        expect(component.find('header').exists()).toEqual(true)
        expect(component.find('.leftIcon').exists()).toEqual(true)
        await component.find('.leftIcon').simulate('click')
        expect(onMonthChange).toHaveBeenCalled()
    })

    it('should display previous icon and next icon if previous month', () => {
        let component = shallow(<Monthly checkins={[mockCheckin]} month={1} onMonthChange={jest.fn} />)
        expect(component.find('header').exists()).toEqual(true)
        expect(component.find('.leftIcon').exists()).toEqual(true)
        expect(component.find('.rightIcon').exists()).toEqual(true)
    })

    it('should change months when clicking the next icon', async () => {
        let onMonthChange = jest.fn()
        let component = mount(<Monthly checkins={[mockCheckin]} month={1} onMonthChange={onMonthChange} />)
        expect(component.find('header').exists()).toEqual(true)
        expect(component.find('.rightIcon').exists()).toEqual(true)
        await component.find('.rightIcon').simulate('click')
        expect(onMonthChange).toHaveBeenCalled()
    })
})
