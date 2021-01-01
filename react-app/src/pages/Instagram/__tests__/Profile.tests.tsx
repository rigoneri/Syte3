import React from 'react'
import { render, screen } from '@testing-library/react'
import Profile from '../Profile'
import { mockUser } from './Instagram.tests'

it('should display the instagram user', () => {
    render(<Profile user={mockUser} />)
    screen.getByRole('heading', { name: mockUser.full_name })
    screen.getByAltText('Instagram Profile')
    expect(screen.getByRole('link', { name: `@${mockUser.username}` })).toHaveAttribute('href', mockUser.url)
    expect(screen.getByText('Posts').textContent).toEqual(`Posts ${mockUser.counts.media}`)
})
