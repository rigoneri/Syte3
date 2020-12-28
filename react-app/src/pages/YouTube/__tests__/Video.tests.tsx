import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Video from '../Video'

export const mockVideo: YouTubeActivity = {
    id: 'GLIaxlf2THA',
    date: '2017-07-13T04:53:33.000Z',
    type: 'youtube',
    title: 'Some Video',
    description: '<p>Some description</p>',
    image: 'https://i.ytimg.com/vi/GLIaxlf2THA/mqdefault.jpg',
}

describe('Video', () => {
    const modalMount = global.document.createElement('div')
    modalMount.setAttribute('id', 'modal-mount')

    beforeEach(() => {
        document.body.appendChild(modalMount)
    })
    afterEach(() => {
        document.body.removeChild(modalMount)
    })

    it('should display a video', () => {
        render(<Video video={mockVideo} />)
        screen.getByText(mockVideo.title)
        expect(screen.getByAltText(mockVideo.title)).toHaveAttribute('src', mockVideo.image)
    })

    it('should display a date formatted from now', () => {
        let now = new Date()
        now.setDate(now.getDate() - 1)

        render(<Video video={{ ...mockVideo, date: now.toISOString() }} />)
        screen.getByText('1 day ago')

        now.setDate(now.getDate() - 30)
        render(<Video video={{ ...mockVideo, date: now.toISOString() }} />)
        screen.getByText('about 1 month ago')
    })

    it('should show a modal when clicking on the video image', () => {
        render(<Video video={mockVideo} />)
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

        const link = screen.getByRole('link', { name: mockVideo.title })
        userEvent.click(link)
        screen.getByRole('dialog')
    })
})
