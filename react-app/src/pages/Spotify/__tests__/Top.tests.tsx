import React from 'react'
import { render, screen } from '@testing-library/react'
import { PlayContext } from '../PlayContext'
import Top from '../Top'
import { mockTrack } from './RecentTracks.tests'

export const mockArtist: SpotifyArtists = {
    name: 'Foo Fighters',
    url: 'https://open.spotify.com/artist/7jy3rLJdDQY21OgRLCZ9sD',
    id: '7jy3rLJdDQY21OgRLCZ9sD',
    genres: ['alternative metal', 'alternative rock', 'modern rock', 'permanent wave', 'post-grunge', 'rock'],
    image: 'https://i.scdn.co/image/c508060cb93f3d2f43ad0dc38602eebcbe39d16d',
    count: 0,
}

describe('Top', () => {
    beforeEach(() => {
        fetchMock.resetMocks()
    })

    it('should fetch top artists and tracks', async () => {
        fetchMock.once(
            JSON.stringify({
                artists: [mockArtist, { ...mockArtist, id: `${mockArtist}-2` }],
                tracks: [mockTrack, { ...mockTrack, id: `${mockTrack}-2` }],
            })
        )
        render(
            <PlayContext.Provider
                value={{
                    playing: null,
                    onPlayTrack: jest.fn(),
                }}>
                <Top />
            </PlayContext.Provider>
        )
        expect(fetchMock).toHaveBeenCalled()
        await screen.findByRole('heading', { name: 'Top Artists' })
        await screen.findByRole('heading', { name: 'Top Tracks' })
    })

    it('should display an error message if it fails to fetch top artists and tracks', async () => {
        fetchMock.mockReject(new Error('Failed Mock'))

        render(
            <PlayContext.Provider
                value={{
                    playing: null,
                    onPlayTrack: jest.fn(),
                }}>
                <Top />
            </PlayContext.Provider>
        )
        expect(fetchMock).toHaveBeenCalled()
        await screen.findByText(/Unable to fetch top artists and tracks/)
    })
})
