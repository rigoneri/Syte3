import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { mockTweet } from './Tweet.tests'
import Modal from '../Modal'

describe('Twitter Modal', () => {
    const modalMount = global.document.createElement('div')
    modalMount.setAttribute('id', 'modal-mount')

    beforeEach(() => {
        document.body.appendChild(modalMount)
    })
    afterEach(() => {
        document.body.removeChild(modalMount)
    })

    it('should render an tweet details', () => {
        render(<Modal item={mockTweet} onClose={jest.fn()} />)
        expect(screen.getByRole('link', { name: 'Avatar' })).toHaveAttribute('href', mockTweet.url)
        expect(screen.getByAltText('Avatar')).toHaveAttribute('src', mockTweet.user.picture)
        screen.getByText(`@${mockTweet.user.username}`)
        screen.getByText(/Testing something.../)
        screen.getByText(/HeartIcon/)
        screen.getByText(/LoopIcon/)
    })

    it('should display a date formatted from now', () => {
        let now = new Date()
        now.setDate(now.getDate() - 1)

        render(<Modal item={{ ...mockTweet, date: now.toISOString() }} onClose={jest.fn()} />)
        screen.getByText('1 day ago')

        now.setDate(now.getDate() - 30)
        render(<Modal item={{ ...mockTweet, date: now.toISOString() }} onClose={jest.fn()} />)
        screen.getByText('about 1 month ago')
    })

    it('should display videos', () => {
        render(<Modal item={{ ...mockTweet }} onClose={jest.fn()} />)
        screen.getByLabelText('video')
        expect(screen.queryByAltText('Twitter Picture')).not.toBeInTheDocument()
    })

    it('should display a single picture', () => {
        const post = { ...mockTweet }
        delete post.video
        render(<Modal item={post} onClose={jest.fn()} />)
        expect(screen.queryByLabelText('video')).not.toBeInTheDocument()
        screen.getByAltText('Twitter Picture')
        expect(screen.queryByText(/LeftIcon/)).not.toBeInTheDocument()
        expect(screen.queryByText(/RightIcon/)).not.toBeInTheDocument()
    })

    it('should be able to navigate multiple pictures', () => {
        let pictures: TwitterPicture[] = [...mockTweet.pictures!]
        pictures.push({
            id: 'pic-2',
            tweetID: mockTweet.id,
            url: 'https://pbs.twimg.com/test-pic-2.jpg',
            width: 360,
            height: 360,
            date: '2019-10-31T12:51:31.000Z',
        })

        const post = { ...mockTweet, pictures }
        delete post.video
        render(<Modal item={post} onClose={jest.fn()} />)
        screen.getByAltText('Twitter Picture')
        expect(screen.getByAltText('Twitter Picture')).toHaveAttribute('src', pictures[0].url)
        screen.getByText(/LeftIcon/)
        screen.getByText(/RightIcon/)

        const rightIcon = screen.getByText(/RightIcon/).closest('span')
        userEvent.click(rightIcon!)
        expect(screen.getByAltText('Twitter Picture')).toHaveAttribute('src', pictures[1].url)

        userEvent.click(rightIcon!)
        expect(screen.getByAltText('Twitter Picture')).toHaveAttribute('src', pictures[0].url)

        const leftIcon = screen.getByText(/LeftIcon/).closest('span')
        userEvent.click(leftIcon!)
        expect(screen.getByAltText('Twitter Picture')).toHaveAttribute('src', pictures[1].url)

        userEvent.click(leftIcon!)
        expect(screen.getByAltText('Twitter Picture')).toHaveAttribute('src', pictures[0].url)
    })
})
