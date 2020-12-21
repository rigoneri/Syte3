import React from 'react'
import { render, screen } from '@testing-library/react'
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
    event: null,
}

describe('Check-in', () => {
    it('should display a check-in', () => {
        render(<Checkin checkin={mockCheckin} />)
        expect(screen.getByRole('link', { name: '' })).toHaveAttribute('href', mockCheckin.url)
        expect(screen.getByRole('link', { name: mockCheckin.title })).toHaveAttribute('href', mockCheckin.url)
        screen.getByText(mockCheckin.category)
        screen.getByText(`${mockCheckin.city}, ${mockCheckin.state}`)
    })

    it('should display a date formatted from now', () => {
        let now = new Date()
        now.setDate(now.getDate() - 1)

        render(<Checkin checkin={{ ...mockCheckin, date: now.toISOString() }} />)
        screen.getByText('1 day ago')

        now.setDate(now.getDate() - 30)
        render(<Checkin checkin={{ ...mockCheckin, date: now.toISOString() }} />)
        screen.getByText('about 1 month ago')
    })
})
