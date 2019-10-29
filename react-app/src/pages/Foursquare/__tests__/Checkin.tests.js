import React from 'react'
import { shallow } from 'enzyme'
import Checkin from '../Checkin'

export const mockCheckin = {
    id: '5daba2a840fb4b00080acc80',
    date: '2019-10-19T23:56:24.000Z',
    type: 'foursquare',
    title: 'AMC BarryWoods 24',
    lat: 39.24341123869826,
    lng: -94.65602167858718,
    city: 'Kansas City',
    state: 'MO',
    country: 'US',
    category: 'Movie Theater',
    icon: 'https://ss3.4sqi.net/img/categories_v2/arts_entertainment/movietheater_64.png',
    url: 'https://foursquare.com/v/4ad9db8df964a520571b21e3',
}

describe('Check-in', () => {
    it('should display a check-in', () => {
        const component = shallow(<Checkin checkin={mockCheckin} />)
        expect(component.find('.icon').exists()).toEqual(true)
        expect(component.find('Img').exists()).toEqual(true)
        expect(component.find('.title').exists()).toEqual(true)
        expect(component.find('.info').exists()).toEqual(true)
        expect(component.find('.category').exists()).toEqual(true)
        expect(component.find('.location').exists()).toEqual(true)
        expect(component.find('.date').exists()).toEqual(true)
    })

    it('should display a date formatted from now', () => {
        let now = new Date()
        now.setDate(now.getDate() - 1)

        let component = shallow(<Checkin checkin={{ ...mockCheckin, date: now.toISOString() }} />)
        expect(component.find('.date').text()).toEqual('1 day ago')

        now.setDate(now.getDate() - 30)
        component = shallow(<Checkin checkin={{ ...mockCheckin, date: now.toISOString() }} />)
        expect(component.find('.date').text()).toEqual('about 1 month ago')
    })
})
