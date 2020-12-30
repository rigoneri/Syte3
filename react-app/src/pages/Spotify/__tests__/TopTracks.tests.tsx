import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PlayContext } from '../PlayContext'
import TopTracks from '../TopTracks'

export const mockTrack: SpotifyTracks = {
    id: '7tFiyTwD0nx5a1eklYtX2J',
    name: 'Bohemian Rhapsody - Remastered 2011',
    url: 'https://open.spotify.com/track/7tFiyTwD0nx5a1eklYtX2J',
    image: 'https://i.scdn.co/image/e2fb26176d381198b5ed65ef395f1485d0bc47dd',
    preview_url: 'https://p.scdn.co/mp3-preview',
    artist: 'Queen',
    count: 0,
}

describe('TopTracks', () => {
    it('should display a list of tracks', () => {
        render(
            <PlayContext.Provider
                value={{
                    playing: null,
                    onPlayTrack: jest.fn(),
                }}>
                <TopTracks tracks={[mockTrack]} />
            </PlayContext.Provider>
        )
        screen.getByRole('heading', { name: 'Top Tracks' })

        screen.getByAltText(mockTrack.name)
        expect(screen.getByAltText(mockTrack.name)).toHaveAttribute('src', mockTrack.image)
        expect(screen.getAllByRole('link', { name: mockTrack.name })[0]).toHaveAttribute('href', mockTrack.url)
        expect(screen.getAllByRole('link', { name: mockTrack.name })[1]).toHaveAttribute('href', mockTrack.url)
        screen.getByText(/PlayLogo/)
    })

    it('should play an audio when playIcon is clicked', async () => {
        const onPlayTrack = jest.fn()
        render(
            <PlayContext.Provider
                value={{
                    playing: null,
                    onPlayTrack,
                }}>
                <TopTracks tracks={[mockTrack]} />
            </PlayContext.Provider>
        )

        screen.getByText(/PlayLogo/)
        const playBtn = screen.getByText(/PlayLogo/).closest('span')
        userEvent.click(playBtn!)
        expect(onPlayTrack).toHaveBeenCalled()
    })

    it('should display a track playing', () => {
        render(
            <PlayContext.Provider
                value={{
                    playing: mockTrack.id,
                    onPlayTrack: jest.fn(),
                }}>
                <TopTracks tracks={[mockTrack]} />
            </PlayContext.Provider>
        )
        expect(screen.queryByText(/PlayLogo/)).not.toBeInTheDocument()
        screen.getByText(/PauseLogo/)
    })
})
