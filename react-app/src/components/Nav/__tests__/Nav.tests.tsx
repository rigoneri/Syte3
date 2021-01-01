import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Nav, NavItem } from '../index'

describe('Navigation', () => {
    it('should display a navigation menu', () => {
        render(
            <MemoryRouter>
                <Nav handleOpened={jest.fn()} opened={false} />
            </MemoryRouter>
        )

        screen.getByRole('navigation')
        expect(screen.queryByText('Twitter')!.closest('a')).toHaveAttribute('href', '/twitter')
        screen.getByText(/About/)
        screen.getByText(/Themes/)
    })

    it('should open a new page when a navigation item is clicked', () => {
        const handleOpened = jest.fn()
        render(
            <MemoryRouter>
                <NavItem to="Twitter" handleClick={handleOpened} />
            </MemoryRouter>
        )

        screen.getByText('Twitter')
        const link = screen.queryByText('Twitter')!.closest('a')
        expect(link).toHaveAttribute('href', '/twitter')
        userEvent.click(link!)
        expect(handleOpened).toHaveBeenCalled()
    })
})
