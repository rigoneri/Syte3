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
        id: '1806534',
    },
    picture: 'https://scontent.cdninstagram.com/vp/d2c3e07f3.jpg',
    pictureHD: 'https://scontent.cdninstagram.com/vp/b91ec857c.jpg',
    likes: 3,
    comments: 0,
    text: 'Some description <a href="http://instagram.com/explore/tags/tag" target="_blank">#tag</a>',
    user: {
        id: '1326084',
        full_name: 'Syte User',
        profile_picture: 'https://scontent.cdninstagram.com/vp/8bf19924.jpg',
        username: 'syte3',
    },
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
                json: () => Promise.resolve([mockPost]),
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
