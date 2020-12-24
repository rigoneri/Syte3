import React from 'react'
import { render, screen } from '@testing-library/react'
import { mockPost } from './Post.tests'
import Modal from '../Modal'

describe('Instagram Modal', () => {
    const modalMount = global.document.createElement('div')
    modalMount.setAttribute('id', 'modal-mount')

    beforeEach(() => {
        document.body.appendChild(modalMount)
    })
    afterEach(() => {
        document.body.removeChild(modalMount)
    })

    it('should render an instagram post details', () => {
        render(<Modal item={mockPost} onClose={jest.fn()} />)
        screen.getByLabelText('video')
        screen.getByText(/Some description/)
    })

    it('should display a date formatted from now', () => {
        let now = new Date()
        now.setDate(now.getDate() - 1)

        render(<Modal item={{ ...mockPost, date: now.toISOString() }} onClose={jest.fn()} />)
        screen.getByText('1 day ago')

        now.setDate(now.getDate() - 30)
        render(<Modal item={{ ...mockPost, date: now.toISOString() }} onClose={jest.fn()} />)
        screen.getByText('about 1 month ago')
    })

    it('should display an instagram image', () => {
        const post = { ...mockPost }
        delete post.video

        render(<Modal item={post} onClose={jest.fn()} />)
        expect(screen.getByAltText('Instagram Post')).toHaveAttribute('src', mockPost.picture)
        expect(screen.queryByLabelText('video')).not.toBeInTheDocument()
    })
})
