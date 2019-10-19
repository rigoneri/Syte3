import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import Top from '../Top'
import { mockTrack } from './RecentTracks.tests'

export const mockArtist = {
    name: 'Foo Fighters',
    url: 'https://open.spotify.com/artist/7jy3rLJdDQY21OgRLCZ9sD',
    id: '7jy3rLJdDQY21OgRLCZ9sD',
    genres: ['alternative metal', 'alternative rock', 'modern rock', 'permanent wave', 'post-grunge', 'rock'],
    image: 'https://i.scdn.co/image/c508060cb93f3d2f43ad0dc38602eebcbe39d16d',
}

describe('Top', () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    afterAll(() => {
        jest.resetAllMocks()
    })

    it('should fetch top artists and tracks', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({
                json: () =>
                    Promise.resolve({
                        artists: [mockArtist, { ...mockArtist, id: `${mockArtist}-2` }],
                        tracks: [mockTrack, { ...mockTrack, id: `${mockTrack}-2` }],
                    }),
            })
        )

        let component = null
        await act(async () => {
            component = mount(<Top />)
        })
        expect(global.fetch).toHaveBeenCalled()
        component.update()

        expect(component.find('TopArtists').exists()).toEqual(true)
        expect(component.find('TopTracks').exists()).toEqual(true)

        component.unmount()
        global.fetch.mockRestore()
    })

    it('should display an error message if it fails to fetch top artists and tracks', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject())

        let component = null
        await act(async () => {
            component = mount(<Top />)
        })
        expect(global.fetch).toHaveBeenCalled()

        component.update()
        expect(component.find('TopArtists').exists()).toEqual(false)
        expect(component.find('TopTracks').exists()).toEqual(false)
        expect(component.find('.error').exists()).toEqual(true)

        component.unmount()
        global.fetch.mockRestore()
    })
})
