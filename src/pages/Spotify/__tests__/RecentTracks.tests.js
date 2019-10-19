import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import { PlayContext } from '../PlayContext'
import RecentTracks from '../RecentTracks'

export const mockTrack = {
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
        jest.resetAllMocks()
    })

    afterAll(() => {
        jest.resetAllMocks()
    })

    it('should fetch and display a recent tracks', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve([mockTrack]),
            })
        )

        const onPlayTrack = jest.fn()
        let component = null
        await act(async () => {
            component = mount(
                <PlayContext.Provider
                    value={{
                        playing: null,
                        onPlayTrack,
                    }}>
                    <RecentTracks />
                </PlayContext.Provider>
            )
        })
        expect(global.fetch).toHaveBeenCalled()
        component.update()
        expect(component.find('.recentTracks').exists()).toEqual(true)
        expect(component.find('.album').exists()).toEqual(true)

        component.unmount()
        global.fetch.mockRestore()
    })

    it('should display an error message if it fails to fetch recent tracks', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject())

        const onPlayTrack = jest.fn()

        let component = null
        await act(async () => {
            component = mount(
                <PlayContext.Provider
                    value={{
                        playing: null,
                        onPlayTrack,
                    }}>
                    <RecentTracks />
                </PlayContext.Provider>
            )
        })
        expect(global.fetch).toHaveBeenCalled()

        component.update()
        expect(component.find('.recentTracks').exists()).toEqual(true)
        expect(component.find('.album').exists()).toEqual(false)
        expect(component.find('.error').exists()).toEqual(true)

        component.unmount()
        global.fetch.mockRestore()
    })

    it('should play an audio when album is clicked', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve([mockTrack]),
            })
        )

        const onPlayTrack = jest.fn()

        let component = null
        await act(async () => {
            component = mount(
                <PlayContext.Provider
                    value={{
                        playing: null,
                        onPlayTrack,
                    }}>
                    <RecentTracks />
                </PlayContext.Provider>
            )
        })
        expect(global.fetch).toHaveBeenCalled()
        component.update()

        expect(component.find('.recentTracks').exists()).toEqual(true)
        expect(component.find('.album').exists()).toEqual(true)

        await component.find('.album').simulate('click')
        expect(onPlayTrack).toHaveBeenCalled()

        component.unmount()
        global.fetch.mockRestore()
    })

    it('should display that the audio is playing', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve([mockTrack]),
            })
        )

        const onPlayTrack = jest.fn()

        let component = null
        await act(async () => {
            component = mount(
                <PlayContext.Provider
                    value={{
                        playing: mockTrack.id,
                        onPlayTrack,
                    }}>
                    <RecentTracks />
                </PlayContext.Provider>
            )
        })
        expect(global.fetch).toHaveBeenCalled()
        component.update()

        expect(component.find('.recentTracks').exists()).toEqual(true)
        expect(component.find('.album').exists()).toEqual(true)
        expect(component.find('.playing').exists()).toEqual(true)

        component.unmount()
        global.fetch.mockRestore()
    })
})
