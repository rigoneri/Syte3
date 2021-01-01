import React from 'react'
import { render, screen } from '@testing-library/react'
import { mockShot } from './Shots.tests'
import Modal from '../Modal'

describe('Dribbble Modal', () => {
    const modalMount = global.document.createElement('div')
    modalMount.setAttribute('id', 'modal-mount')

    beforeEach(() => {
        document.body.appendChild(modalMount)
    })
    afterEach(() => {
        document.body.removeChild(modalMount)
    })

    it('should render an dribbble shot details', () => {
        render(<Modal item={mockShot} onClose={jest.fn()} />)
        expect(screen.getByAltText('Dribbble Shot')).toHaveAttribute('src', mockShot.pictureHD)
        screen.getByText('Some test dribbble shot.')
    })

    it('should display a date formatted from now', () => {
        let now = new Date()
        now.setDate(now.getDate() - 1)

        render(<Modal item={{ ...mockShot, date: now.toISOString() }} onClose={jest.fn()} />)
        screen.getByText('1 day ago')

        now.setDate(now.getDate() - 30)
        render(<Modal item={{ ...mockShot, date: now.toISOString() }} onClose={jest.fn()} />)
        screen.getByText('about 1 month ago')
    })
})
