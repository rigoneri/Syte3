import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Post from '../Post'

export const mockPost: InstagramActivity = {
    id: '2676728',
    date: '2019-09-08T00:10:59.000Z',
    type: 'instagram',
    url: 'https://www.instagram.com/p/B2ISjx8nzis/',
    video: {
        width: 640,
        height: 800,
        url: 'https://scontent.cdninstagram.com/v/7713e4.mp4',
    },
    picture: 'https://scontent.cdninstagram.com/vp/d2c3e07f3.jpg',
    text: 'Some description <a href="http://instagram.com/explore/tags/tag" target="_blank">#tag</a>',
}

describe('Post', () => {
    const modalMount = global.document.createElement('div')
    modalMount.setAttribute('id', 'modal-mount')

    beforeEach(() => {
        document.body.appendChild(modalMount)
    })
    afterEach(() => {
        document.body.removeChild(modalMount)
    })

    it('should display an instagram image', () => {
        const post: InstagramActivity = { ...mockPost }
        delete post.video
        render(<Post post={post} />)
        expect(screen.getByRole('link', { name: 'Instagram Post' })).toHaveAttribute('href', post.url)
        expect(screen.getByAltText('Instagram Post')).toHaveAttribute('src', post.picture)
        expect(screen.queryByRole('figure')).not.toBeInTheDocument()
    })

    it('should display an instagram video', () => {
        const post: InstagramActivity = { ...mockPost }
        render(<Post post={post} />)
        expect(screen.getByRole('link', { name: 'Instagram Post' })).toHaveAttribute('href', post.url)
        expect(screen.getByRole('figure')).toHaveAttribute('class', 'video')
    })

    it('should show a modal when clicking the instagram post', () => {
        const post: InstagramActivity = { ...mockPost }
        delete post.video
        render(<Post post={post} />)
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

        const link = screen.getByRole('link', { name: 'Instagram Post' })
        userEvent.click(link)
        screen.getByRole('dialog')
    })
})
