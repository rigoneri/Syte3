import React from 'react'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
    const modalMount = global.document.createElement('div')
    modalMount.setAttribute('id', 'modal-mount')

    beforeEach(() => {
        document.body.appendChild(modalMount)
        fetchMock.resetMocks()
    })
    afterEach(() => {
        document.body.removeChild(modalMount)
    })

    it('should fetch and display a list of dribbble shots', async () => {
        fetchMock.once(
            JSON.stringify({
                data: [mockShot],
                nextPage: null,
            })
        )

        render(<Shots />)
        expect(fetchMock).toHaveBeenCalled()
        await screen.findByAltText(mockShot.title)
        expect(screen.getByAltText(mockShot.title)).toHaveAttribute('src', mockShot.picture)
        expect(screen.getByRole('link')).toHaveAttribute('href', mockShot.url)
    })

    it('should display an error message if it fails to fetch dribbble shots', async () => {
        fetchMock.mockReject(new Error('Failed Mock'))

        render(<Shots />)
        expect(fetchMock).toHaveBeenCalled()
        await screen.findByText(/Unable to fetch Dribbble shots/)
        expect(screen.queryByAltText(mockShot.title)).not.toBeInTheDocument()
    })

    it('should load more tweets when scrolling to the end of the page', async () => {
        fetchMock.mockResponses(
            [
                JSON.stringify({
                    data: [{ ...mockShot, title: 'First Shot', id: `first` }],
                    nextPage: 1,
                }),
                { status: 200 },
            ],
            [
                JSON.stringify({
                    data: [{ ...mockShot, title: 'Second Shot', id: `second` }],
                    nextPage: null,
                }),
                { status: 200 },
            ]
        )

        render(<Shots />)
        expect(fetchMock).toHaveBeenCalledTimes(1)
        await screen.findByAltText('First Shot')

        await act(async () => {
            const customEvent = new Event('scroll')
            window.dispatchEvent(customEvent)
        })
        expect(fetchMock).toHaveBeenCalledTimes(2)
        await screen.findByAltText('Second Shot')
    })

    it('should show a modal when clicking the dribbble shot', async () => {
        fetchMock.once(
            JSON.stringify({
                data: [mockShot],
                nextPage: null,
            })
        )

        render(<Shots />)
        expect(fetchMock).toHaveBeenCalled()

        await screen.findByAltText(mockShot.title)
        const link = screen.getByRole('link')
        userEvent.click(link)
        screen.getByRole('dialog')
    })
})
