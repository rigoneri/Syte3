import React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import { format } from 'date-fns'
import { mockCheckin } from './Checkin.tests'
import Checkins from '../Checkins'

jest.mock('../Map', () => {
    return {
        __esModule: true,
        default: () => {
            return <div />
        },
    }
})

describe('Check-ins', () => {
    const RealDate = Date

    beforeEach(() => {
        fetchMock.resetMocks()
    })

    afterEach(() => {
        global.Date = RealDate
    })

    it('should fetch and display a list of check-ins', async () => {
        fetchMock.once(
            JSON.stringify({
                data: [mockCheckin],
            })
        )

        render(<Checkins />)
        expect(fetchMock).toHaveBeenCalled()
        expect(screen.getByRole('heading', { name: 'Recent Check-ins' }))
        await screen.findByText(mockCheckin.title)
        screen.getByRole('heading', { name: format(new Date(), 'MMMM yyyy') })
    })

    it('should display an error message if it fails to fetch check-ins', async () => {
        fetchMock.mockReject(new Error('Failed Mock'))
        render(<Checkins />)
        expect(fetchMock).toHaveBeenCalled()

        expect(screen.getByRole('heading', { name: 'Recent Check-ins' }))
        await screen.findByText(/Unable to fetch recent check-ins/)
        expect(screen.queryByText(mockCheckin.title)).not.toBeInTheDocument()
        expect(screen.queryByRole('heading', { name: format(new Date(), 'MMMM yyyy') })).not.toBeInTheDocument()
    })

    it('should load more check-ins when scrolling to the end of the page', async () => {
        fetchMock.mockResponse(
            JSON.stringify({
                data: [{ ...mockCheckin, id: `${new Date().getTime()}` }],
            })
        )

        // @ts-ignore
        global.Date = class extends Date {
            constructor() {
                super('2019-11-20T11:01:58.135Z')
            }
        }

        render(<Checkins />)
        expect(fetchMock).toHaveBeenCalledTimes(1)
        await screen.findByText(mockCheckin.title)

        await act(async () => {
            const customEvent = new Event('scroll')
            window.dispatchEvent(customEvent)
        })
        expect(fetchMock).toHaveBeenCalledTimes(2)
    })

    it('should attempt to fetch more pages if empty results', async () => {
        fetchMock.mockResponse(
            JSON.stringify({
                data: [],
            })
        )

        render(<Checkins />)
        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3))
    })

    it('should fetch the last 2 months of checkins if it is the first half of the month', async () => {
        fetchMock.mockResponse(
            JSON.stringify({
                data: [{ ...mockCheckin, id: `${new Date().getTime()}` }],
            })
        )

        // @ts-ignore
        global.Date = class extends Date {
            constructor() {
                super('2019-11-10T11:01:58.135Z')
            }
        }
        render(<Checkins />)
        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
    })
})
