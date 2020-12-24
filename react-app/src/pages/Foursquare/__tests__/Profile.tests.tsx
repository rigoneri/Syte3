import React from 'react'
import { render, screen } from '@testing-library/react'
import Profile from '../Profile'
import { mockUser } from './Foursquare.tests'

describe('Profile', () => {
    it('should display the foursquare user', () => {
        render(<Profile user={mockUser} />)
        screen.getByRole('heading', { name: mockUser.name })
        expect(screen.getByAltText('Foursquare Profile')).toHaveAttribute('src', mockUser.picture)
        expect(screen.getByRole('link')).toHaveAttribute('href', mockUser.url)
        screen.getByText(mockUser.location)
        expect(screen.getByText('Check-ins').textContent).toEqual(`Check-ins ${mockUser.checkins!.toLocaleString()}`)
        expect(screen.getByText('Friends').textContent).toEqual(`Friends ${mockUser.friends!.toLocaleString()}`)
    })
})
