import React from 'react'
import { render, screen } from '@testing-library/react'
import Profile from '../Profile'
import { mockUser } from './Github.tests'

describe('Profile', () => {
    it('should display the github user', () => {
        render(<Profile user={mockUser} />)
        screen.getByRole('heading', { name: mockUser.name })
        expect(screen.getByAltText('Github Profile')).toHaveAttribute('src', mockUser.picture)
        expect(screen.getByRole('link', { name: mockUser.username })).toHaveAttribute('href', mockUser.url)
        screen.getByText(mockUser.description)
        expect(screen.getByText('Repos').textContent).toEqual('Repos 1')
        expect(screen.getByText('Following').textContent).toEqual(`Following ${mockUser.following}`)
        expect(screen.getByText('Followers').textContent).toEqual(`Followers ${mockUser.followers}`)
    })

    it('should not display description if the user has no description', () => {
        let user: GithubUser = { ...mockUser }
        delete user.description
        render(<Profile user={user} />)
        screen.getByRole('heading', { name: mockUser.name })
        expect(screen.queryByText(mockUser.description)).not.toBeInTheDocument()
    })
})
