import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { mockShot } from './Shots.tests'
import { TimelineItem } from '../TimelineItem'

describe('TimelineItem', () => {
    const modalMount = global.document.createElement('div')
    modalMount.setAttribute('id', 'modal-mount')

    beforeEach(() => {
        document.body.appendChild(modalMount)
    })
    afterEach(() => {
        document.body.removeChild(modalMount)
    })

    it('should display an dribbble shot', () => {
        render(<TimelineItem item={mockShot} />)
        screen.getByText(mockShot.title)
        expect(screen.getByRole('link', { name: '' })).toHaveAttribute('href', mockShot.url)
    })

    it('should show a modal when clicking the dribbble shot', () => {
        render(<TimelineItem item={mockShot} />)
        expect(screen.queryByText(/Some test dribbble shot/)).not.toBeInTheDocument()
        const link = screen.getByRole('link', { name: '' })
        userEvent.click(link)
        screen.getByText(/Some test dribbble shot/)
    })
})
