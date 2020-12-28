import React from 'react'
import { getByText, render, screen } from '@testing-library/react'
import Profile from '../Profile'
import { mockUser } from './Twitter.tests'

describe('Profile', () => {
    it('should display a user profile', () => {
        render(<Profile user={mockUser} />)
        screen.getByRole('heading', { name: mockUser.name })
        expect(screen.getByAltText('Twitter Profile')).toHaveAttribute('src', mockUser.picture)
        expect(screen.getByRole('link', { name: `@${mockUser.username}` })).toHaveAttribute('href', mockUser.url)
        screen.getByText(mockUser.description)
        expect(screen.getByText('Tweets').textContent).toEqual(`Tweets ${mockUser.statuses}`)
        expect(screen.getByText('Following').textContent).toEqual(`Following ${mockUser.following}`)
        expect(screen.getByText('Followers').textContent).toEqual(`Followers ${mockUser.followers}`)
        screen.getByText('Recent Photos')
    })

    it('should not display description if user has no description', () => {
        render(<Profile user={{ ...mockUser, description: null }} />)
        screen.getByRole('heading', { name: mockUser.name })
        expect(screen.getByAltText('Twitter Profile')).toHaveAttribute('src', mockUser.picture)
        expect(screen.queryByText(mockUser.description)).not.toBeInTheDocument()
    })

    it('should not display pictures if user has no pictures', () => {
        let user: TwitterUser = { ...mockUser }
        delete user.pictures
        render(<Profile user={user} />)
        screen.getByRole('heading', { name: mockUser.name })
        expect(screen.getByAltText('Twitter Profile')).toHaveAttribute('src', mockUser.picture)
        expect(screen.queryByText('Recent Photos')).not.toBeInTheDocument()
    })
})
