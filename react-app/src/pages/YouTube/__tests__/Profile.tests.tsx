import React from 'react'
import { render, screen } from '@testing-library/react'
import Profile from '../Profile'
import { mockUser } from './YouTube.tests'

describe('Profile', () => {
    it('should display the youtube user', () => {
        render(<Profile user={mockUser} />)
        screen.getByRole('heading', { name: mockUser.name })
        expect(screen.getByAltText('YouTube Profile')).toHaveAttribute('src', mockUser.picture)
        expect(screen.getByText('Subscribers').textContent).toEqual(`${mockUser.subscribers} Subscribers`)
    })
})
