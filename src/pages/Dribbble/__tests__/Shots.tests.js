import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import Shots from '../Shots'

export const mockShot = {
    id: 2676728,
    date: '2016-04-26T21:03:47.000Z',
    type: 'dribbble',
    title: 'Test Shot',
    text: '<p>Some test dribbble shot.</p>',
    url: 'https://dribbble.com/shots/2676728-KCFPV-Logo',
    picture: 'https://cdn.dribbble.com/users/27745/screenshots/2676728/dribb_1x.png',
    pictureHD: 'https://cdn.dribbble.com/users/27745/screenshots/2676728/dribb.png',
}

describe('Shots', () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    afterAll(() => {
        jest.resetAllMocks()
    })

    it('should fetch and display a list of dribbble shots', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve([mockShot]),
            })
        )

        let component = null
        await act(async () => {
            component = mount(<Shots />)
        })
        expect(global.fetch).toHaveBeenCalled()
        component.update()
        expect(component.find('.shot').exists()).toEqual(true)

        component.unmount()
        global.fetch.mockRestore()
    })

    it('should display an error message if it fails to fetch dribbble shots', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject())

        let component = null
        await act(async () => {
            component = mount(<Shots />)
        })
        expect(global.fetch).toHaveBeenCalled()

        component.update()
        expect(component.find('.shot').exists()).toEqual(false)
        expect(component.find('.error').exists()).toEqual(true)

        component.unmount()
        global.fetch.mockRestore()
    })

    it('should load more tweets when scrolling to the end of the page', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve([{ ...mockShot, id: `${new Date().getTime()}` }]),
            })
        )

        let component = null
        await act(async () => {
            component = mount(<Shots />)
        })
        expect(global.fetch).toHaveBeenCalledTimes(1)
        component.update()

        expect(component.find('.shot').exists()).toEqual(true)

        await act(async () => {
            const customEvent = new Event('scroll')
            window.dispatchEvent(customEvent)
        })
        expect(global.fetch).toHaveBeenCalledTimes(2)

        component.unmount()
        global.fetch.mockRestore()
    })

    it('should attempt to fetch more pages if empty results', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve([]),
            })
        )

        let component = null
        await act(async () => {
            component = mount(<Shots />)
        })
        expect(global.fetch).toHaveBeenCalledTimes(3)

        component.unmount()
        global.fetch.mockRestore()
    })

    it('should show a modal when clicking the dribbble shot', async () => {
        const modalMount = global.document.createElement('div')
        modalMount.setAttribute('id', 'modal-mount')
        global.document.querySelector('body').appendChild(modalMount)

        jest.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve([mockShot]),
            })
        )

        let component = null
        await act(async () => {
            component = mount(<Shots />)
        })
        expect(global.fetch).toHaveBeenCalled()
        component.update()

        expect(component.find('Modal').exists()).toEqual(false)
        component.find('.shot').simulate('click')
        expect(component.find('Modal').exists()).toEqual(true)

        component.unmount()
        global.fetch.mockRestore()
    })
})
