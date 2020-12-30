import React from 'react'
import { render, screen } from '@testing-library/react'
import { TimelineItem } from '../TimelineItem'

const mockItem: SpotifyTimelineActivity = {
    id: '5db34a25376931c78a6c1a50',
    date: '2019-10-26T04:59:00.000Z',
    type: 'spotify',
    plays: 24,
    tracks: [
        {
            id: 'first-track',
            title: 'In This Love',
            artist: 'Stick Figure',
            image: 'https://i.scdn.co/image/ab67616d00004851655dfb391e8f4de54f87ab07',
            url: 'https://open.spotify.com/track/3u1bKblfqeghD3grk3Le2w',
        },
        {
            id: 'second-track',
            title: 'Morning',
            artist: 'SOJA',
            image: 'https://i.scdn.co/image/ab67616d00001e029cc579fea22ae1a46b4b76e8',
            url: 'https://open.spotify.com/track/7kMLiooQZZrAOeruVRr9AJ',
        },
    ],
}

describe('TimelineItem', () => {
    it('should display a list of played tracks', () => {
        render(<TimelineItem item={mockItem} />)

        expect(screen.getByText(/Listened to/).textContent).toEqual(
            'Listened to In This Love by Stick Figure and 23 other tracks on Spotify.'
        )
        screen.getByAltText(mockItem.tracks[0].title)
        expect(screen.getByAltText(mockItem.tracks[0].title)).toHaveAttribute('src', mockItem.tracks[0].image)
        expect(screen.getAllByRole('link', { name: mockItem.tracks[0].title })[1]).toHaveAttribute(
            'href',
            mockItem.tracks[0].url
        )

        screen.getByAltText(mockItem.tracks[1].title)
        expect(screen.getByAltText(mockItem.tracks[1].title)).toHaveAttribute('src', mockItem.tracks[1].image)
        expect(screen.getByRole('link', { name: mockItem.tracks[1].title })).toHaveAttribute(
            'href',
            mockItem.tracks[1].url
        )
    })

    it('should display a single track', () => {
        const singleTrackItem = { ...mockItem }
        singleTrackItem.plays = 1
        singleTrackItem.tracks = [mockItem.tracks[0]]

        render(<TimelineItem item={singleTrackItem} />)
        expect(screen.getByText(/Listened to/).textContent).toEqual(
            'Listened to In This Love by Stick Figure on Spotify.'
        )
        screen.getByAltText(mockItem.tracks[0].title)
        expect(screen.getByAltText(mockItem.tracks[0].title)).toHaveAttribute('src', mockItem.tracks[0].image)
        expect(screen.getAllByRole('link', { name: mockItem.tracks[0].title })[1]).toHaveAttribute(
            'href',
            mockItem.tracks[0].url
        )
    })

    it('should display total played with no tracks', () => {
        const noTracksItem = { ...mockItem }
        noTracksItem.tracks = []

        render(<TimelineItem item={noTracksItem} />)
        expect(screen.getByText(/Listened to/).textContent).toEqual('Listened to 24 tracks on Spotify.')
        expect(screen.queryByRole('list')).not.toBeInTheDocument()
    })

    it('should display a single play with no tracks', () => {
        const noTracksItem = { ...mockItem }
        noTracksItem.plays = 1
        noTracksItem.tracks = []

        render(<TimelineItem item={noTracksItem} />)
        expect(screen.getByText(/Listened to/).textContent).toEqual('Listened to 1 track on Spotify.')
        expect(screen.queryByRole('list')).not.toBeInTheDocument()
    })
})
