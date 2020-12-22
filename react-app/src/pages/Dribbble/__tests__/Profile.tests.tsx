import React from 'react'
import { render, screen } from '@testing-library/react'
import Profile from '../Profile'
import { mockUser } from './Dribbble.tests'

describe('Profile', () => {
    it('should display the dribbble user', () => {
        render(<Profile user={mockUser} />)
        screen.getByRole('heading', { name: mockUser.name })
        expect(screen.getByAltText('Dribbble Profile')).toHaveAttribute('src', mockUser.picture)
        expect(screen.getByRole('link', { name: `@${mockUser.username}` })).toHaveAttribute('href', mockUser.url)
        screen.getByText(mockUser.bio)
        expect(screen.getByText('Followers').textContent).toEqual(`Followers ${mockUser.followers.toLocaleString()}`)
    })

    it('should not display bio if the user has no bio', () => {
        let user: DribbbleUser = { ...mockUser }
        delete user.bio
        render(<Profile user={user} />)
        screen.getByRole('heading', { name: mockUser.name })
        expect(screen.queryByText(mockUser.bio)).not.toBeInTheDocument()
    })
})
