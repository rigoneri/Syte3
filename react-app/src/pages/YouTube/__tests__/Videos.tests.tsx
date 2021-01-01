import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { mockVideo } from './Video.tests'
import Videos from '../Videos'

describe('Videos', () => {
    const modalMount = global.document.createElement('div')
    modalMount.setAttribute('id', 'modal-mount')

    beforeEach(() => {
        document.body.appendChild(modalMount)
        fetchMock.resetMocks()
    })
    afterEach(() => {
        document.body.removeChild(modalMount)
    })

    it('should fetch and display a list of videos', async () => {
        fetchMock.mockResponses(
            [
                JSON.stringify({
                    data: [{ ...mockVideo, id: 'upload' }],
                    nextPage: 1,
                }),
                { status: 200 },
            ],
            [
                JSON.stringify({
                    data: [{ ...mockVideo, id: 'like' }],
                    nextPage: null,
                }),
                { status: 200 },
            ]
        )

        render(<Videos />)
        expect(fetchMock).toHaveBeenCalledTimes(2)
        await screen.findByTestId('video-upload')
        await screen.findByTestId('video-like')
        screen.getByRole('heading', { name: 'Uploads' })
        screen.getByRole('heading', { name: 'Liked Videos' })
    })

    it('should display an error message if it fails to fetch videos', async () => {
        fetchMock.mockReject(new Error('Failed Mock'))

        render(<Videos />)
        expect(fetchMock).toHaveBeenCalled()

        await screen.findByText(/Unable to fetch videos/)
        screen.getByRole('heading', { name: 'Videos' })
    })

    it('should load more videos when scrolling to the end of the page', async () => {
        fetchMock.mockResponses(
            [
                JSON.stringify({
                    data: [{ ...mockVideo, id: 'upload' }],
                    nextPage: 1,
                }),
                { status: 200 },
            ],
            [
                JSON.stringify({
                    data: [{ ...mockVideo, id: 'like' }],
                    nextPage: 1,
                }),
                { status: 200 },
            ],
            [
                JSON.stringify({
                    data: [{ ...mockVideo, id: 'upload-2' }],
                    nextPage: null,
                }),
                { status: 200 },
            ],
            [
                JSON.stringify({
                    data: [{ ...mockVideo, id: 'like-2' }],
                    nextPage: null,
                }),
                { status: 200 },
            ]
        )

        render(<Videos />)
        expect(fetchMock).toHaveBeenCalledTimes(2)
        await screen.findByTestId('video-upload')
        await screen.findByTestId('video-like')

        await act(async () => {
            const customEvent = new Event('scroll')
            window.dispatchEvent(customEvent)
        })
        expect(fetchMock).toHaveBeenCalledTimes(4)
        await screen.findByTestId('video-upload')
        await screen.findByTestId('video-upload-2')
        await screen.findByTestId('video-like')
        await screen.findByTestId('video-like-2')
    })
})
