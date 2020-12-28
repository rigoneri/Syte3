import React from 'react'
import { render, screen } from '@testing-library/react'
import { mockVideo } from './Video.tests'
import Modal from '../Modal'

describe('YouTube Modal', () => {
    const modalMount = global.document.createElement('div')
    modalMount.setAttribute('id', 'modal-mount')

    beforeEach(() => {
        document.body.appendChild(modalMount)
    })
    afterEach(() => {
        document.body.removeChild(modalMount)
    })

    it('should render a YouTube video details', () => {
        render(<Modal item={mockVideo} onClose={jest.fn()} />)
        screen.getByRole('presentation')
        screen.getByRole('heading', { name: mockVideo.title })
        screen.getByText('Some description')
    })

    it('should display a date formatted from now', () => {
        let now = new Date()
        now.setDate(now.getDate() - 1)

        render(<Modal item={{ ...mockVideo, date: now.toISOString() }} onClose={jest.fn()} />)
        screen.getByText('1 day ago')

        now.setDate(now.getDate() - 30)
        render(<Modal item={{ ...mockVideo, date: now.toISOString() }} onClose={jest.fn()} />)
        screen.getByText('about 1 month ago')
    })
})
