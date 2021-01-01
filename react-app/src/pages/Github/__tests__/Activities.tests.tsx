import React from 'react'
import fetchMock from 'jest-fetch-mock'
import { render, screen } from '@testing-library/react'
import Activities from '../Activities'

export const mockActivity: GitActivity = {
    id: '12345',
    icon: 'git-commit' as GitIcon,
    date: '2019-10-16T02:21:11.000Z',
    type: 'github',
    description:
        'Pushed 1 commit to <strong>master</strong> at <a href="https://github.com/rigoneri/Syte3" target="_blank">rigoneri/Syte3</a>',
}

describe('Activities', () => {
    beforeEach(() => {
        fetchMock.resetMocks()
    })

    it('should fetch the github recent activity', async () => {
        fetchMock.once(
            JSON.stringify({
                data: [mockActivity],
                nextPage: null,
            })
        )

        render(<Activities />)
        screen.getByRole('heading', { name: /Recent Activity/ })
        screen.getByText(/Loading/)
        expect(fetchMock).toHaveBeenCalled()

        await screen.findByText(/Pushed 1 commit/)
        expect(screen.queryByText(/Loading/)).not.toBeInTheDocument()
        expect(screen.queryByText(/No recent activity/)).not.toBeInTheDocument()
        expect(screen.queryByText(/Unable to fetch/)).not.toBeInTheDocument()
    })

    it('should display an error message if it fails to fetch recent activity', async () => {
        fetchMock.mockRejectOnce(new Error('Failed Mock'))

        render(<Activities />)
        screen.getByRole('heading', { name: /Recent Activity/ })
        screen.getByText(/Loading/)
        expect(fetchMock).toHaveBeenCalled()

        await screen.findByText(/Unable to fetch recent activity/)
        expect(screen.queryByText(/Loading/)).not.toBeInTheDocument()
        expect(screen.queryByText(/No recent activity/)).not.toBeInTheDocument()
        expect(screen.queryByText(/Pushed 1 commit/)).not.toBeInTheDocument()
    })

    it('should display an empty message if there is no recent activity', async () => {
        fetchMock.once(
            JSON.stringify({
                data: [],
                nextPage: null,
            })
        )

        render(<Activities />)
        screen.getByRole('heading', { name: /Recent Activity/ })
        screen.getByText(/Loading/)
        expect(fetchMock).toHaveBeenCalled()

        await screen.findByText(/No recent activity/)
        expect(screen.queryByText(/Loading/)).not.toBeInTheDocument()
        expect(screen.queryByText(/Pushed 1 commit/)).not.toBeInTheDocument()
        expect(screen.queryByText(/Unable to fetch/)).not.toBeInTheDocument()
    })
})
