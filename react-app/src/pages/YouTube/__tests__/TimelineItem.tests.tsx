import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { mockVideo } from './Video.tests'
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

    it('should display a youtube video', () => {
        render(<TimelineItem item={{ ...mockVideo, type: 'youtube' }} />)
        screen.getByRole('heading', { name: 'Posted to YouTube' })
        screen.getByText(mockVideo.title)
        screen.getByRole('img')
        screen.getByText(/PlayLogo/)
    })

    it('should display a liked youtube video', () => {
        render(<TimelineItem item={{ ...mockVideo, type: 'youtube-like' }} />)
        screen.getByRole('heading', { name: 'Liked on YouTube' })
        screen.getByText(mockVideo.title)
    })

    it('should show a modal when clicking on the video image', () => {
        render(<TimelineItem item={{ ...mockVideo, type: 'youtube' }} />)
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

        const link = screen.getByRole('link', { name: /PlayLogo/ })
        userEvent.click(link)
        screen.getByRole('dialog')
    })
})
