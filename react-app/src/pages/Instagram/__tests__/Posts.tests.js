import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import Posts from '../Posts'

export const mockPost = {
    id: '2676728',
    date: '2019-09-08T00:10:59.000Z',
    type: 'instagram',
    url: 'https://www.instagram.com/p/B2ISjx8nzis/',
    video: {
        width: 640,
        height: 800,
        url: 'https://scontent.cdninstagram.com/v/7713e4.mp4',
    },
    picture: 'https://scontent.cdninstagram.com/vp/d2c3e07f3.jpg',
    text: 'Some description <a href="http://instagram.com/explore/tags/tag" target="_blank">#tag</a>',
}

describe('Posts', () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    afterAll(() => {
        jest.resetAllMocks()
    })

    it('should fetch and display a list of instagram posts', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve({ data: [mockPost], nextPage: null }),
            })
        )

        let component = null
        await act(async () => {
            component = mount(<Posts />)
        })
        expect(global.fetch).toHaveBeenCalled()
        component.update()
        expect(component.find('.post').exists()).toEqual(true)

        component.unmount()
        global.fetch.mockRestore()
    })

    it('should display an error message if it fails to fetch instagram posts', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject())

        let component = null
        await act(async () => {
            component = mount(<Posts />)
        })
        expect(global.fetch).toHaveBeenCalled()

        component.update()
        expect(component.find('.post').exists()).toEqual(false)
        expect(component.find('.error').exists()).toEqual(true)

        component.unmount()
        global.fetch.mockRestore()
    })
})
