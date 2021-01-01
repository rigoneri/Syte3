import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from '../index'

it('should display a header with a nav', () => {
    render(
        <MemoryRouter>
            <Header />
        </MemoryRouter>
    )
    screen.getByRole('heading', { name: 'Rodrigo Neri' })
    screen.getByRole('img', { name: 'Profile' })
    screen.getByRole('navigation')
})
