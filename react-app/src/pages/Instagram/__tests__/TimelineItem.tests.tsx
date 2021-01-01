import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { mockPost } from './Post.tests'
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

    it('should display an instagram image', () => {
        const post = { ...mockPost }
        delete post.video
        render(<TimelineItem item={post} />)
        screen.getByText(/Some description/)
        expect(screen.getByRole('link', { name: '#tag' })).toHaveAttribute(
            'href',
            'http://instagram.com/explore/tags/tag'
        )
        expect(screen.getByRole('link', { name: '' })).toHaveAttribute('href', post.url)
    })

    it('should display an instagram post with video', () => {
        const post = { ...mockPost }
        render(<TimelineItem item={post} />)
        screen.getByText(/Some description/)
        expect(screen.getByRole('img')).toHaveAttribute('class', 'video')
    })

    it('should show a modal when clicking the instagram post', () => {
        const post = { ...mockPost }
        delete post.video
        render(<TimelineItem item={post} />)
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

        const link = screen.getByRole('link', { name: '' })
        userEvent.click(link)
        screen.getByRole('dialog')
    })
})
