import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PlayContext } from '../PlayContext'
import RecentTracks from '../RecentTracks'

export const mockTrack: SpotifyActivity = {
    title: 'Bohemian Rhapsody - Remastered 2011',
    url: 'https://open.spotify.com/track/7tFiyTwD0nx5a1eklYtX2J',
    id: '7tFiyTwD0nx5a1eklYtX2J',
    day: '2019-10-19',
    date: '2019-10-19T17:50:59.658Z',
    artist: 'Queen',
    image: 'https://i.scdn.co/image/e2fb26176d381198b5ed65ef395f1485d0bc47dd',
    preview_url: 'https://p.scdn.co/mp3-preview',
}

describe('RecentTracks', () => {
    beforeEach(() => {
        fetchMock.resetMocks()
    })

    it('should fetch and display a recent tracks', async () => {
        fetchMock.once(
            JSON.stringify({
                data: [mockTrack],
                nextPage: null,
            })
        )

        const onPlayTrack = jest.fn()
        render(
            <PlayContext.Provider
                value={{
                    playing: null,
                    onPlayTrack,
                }}>
                <RecentTracks />
            </PlayContext.Provider>
        )

        expect(fetchMock).toHaveBeenCalled()
        await screen.findByRole('heading', { name: 'Recent Tracks' })
        screen.getByAltText(mockTrack.title)
        expect(screen.getByAltText(mockTrack.title)).toHaveAttribute('src', mockTrack.image)
        expect(screen.getAllByRole('link', { name: mockTrack.title })[0]).toHaveAttribute('href', mockTrack.url)
        screen.getByText(/PlayLogo/)
    })

    it('should display an error message if it fails to fetch recent tracks', async () => {
        fetchMock.mockReject(new Error('Failed Mock'))
        const onPlayTrack = jest.fn()

        render(
            <PlayContext.Provider
                value={{
                    playing: null,
                    onPlayTrack,
                }}>
                <RecentTracks />
            </PlayContext.Provider>
        )
        expect(fetchMock).toHaveBeenCalled()

        await screen.findByRole('heading', { name: 'Recent Tracks' })
        await screen.findByText(/Unable to fetch recent tracks/)
    })

    it('should play an audio when album is clicked', async () => {
        fetchMock.once(
            JSON.stringify({
                data: [mockTrack],
                nextPage: null,
            })
        )

        const onPlayTrack = jest.fn()
        render(
            <PlayContext.Provider
                value={{
                    playing: null,
                    onPlayTrack,
                }}>
                <RecentTracks />
            </PlayContext.Provider>
        )
        expect(fetchMock).toHaveBeenCalled()
        await screen.findByRole('heading', { name: 'Recent Tracks' })
        screen.getByAltText(mockTrack.title)

        screen.getByText(/PlayLogo/)
        const playBtn = screen.getByText(/PlayLogo/).closest('a')
        userEvent.click(playBtn!)
        expect(onPlayTrack).toHaveBeenCalled()
    })

    it('should display that the audio is playing', async () => {
        fetchMock.once(
            JSON.stringify({
                data: [mockTrack],
                nextPage: null,
            })
        )

        const onPlayTrack = jest.fn()
        render(
            <PlayContext.Provider
                value={{
                    playing: mockTrack.id,
                    onPlayTrack,
                }}>
                <RecentTracks />
            </PlayContext.Provider>
        )
        expect(fetchMock).toHaveBeenCalled()
        await screen.findByRole('heading', { name: 'Recent Tracks' })
        expect(screen.queryByText(/PlayLogo/)).not.toBeInTheDocument()
        screen.getByText(/PauseLogo/)
    })
})
