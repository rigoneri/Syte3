import React from 'react'
import { render, screen } from '@testing-library/react'
import { mockCheckin } from './Checkin.tests'
import { TimelineItem } from '../TimelineItem'

it('should display a check-in', () => {
    render(<TimelineItem item={mockCheckin} />)
    expect(screen.getByRole('img')).toHaveAttribute('src', mockCheckin.icon)
    expect(screen.getByRole('link', { name: mockCheckin.title })).toHaveAttribute('href', mockCheckin.url)
    screen.getByText(`${mockCheckin.category}`)
    screen.getByText(`${mockCheckin.city}, ${mockCheckin.state}`)
})
