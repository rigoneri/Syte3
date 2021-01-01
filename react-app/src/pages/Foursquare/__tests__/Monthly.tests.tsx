import React from 'react'
import { render, screen, getByText } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { format } from 'date-fns'
import { mockCheckin } from './Checkin.tests'
import Monthly from '../Monthly'

jest.mock('../Map', () => {
    return {
        __esModule: true,
        default: () => {
            return <div />
        },
    }
})

describe('Monthly', () => {
    it('should display monthly check-ins and a map', () => {
        render(<Monthly checkins={[mockCheckin]} month={0} onMonthChange={jest.fn} />)
        screen.getByRole('heading', { name: format(new Date(), 'MMMM yyyy') })
        screen.getByTestId('map')
        screen.getByText(mockCheckin.category!)
        screen.getByText('1 time')
    })

    it('should display check-ins grouped by category sorted by count descending', () => {
        let checkins = [
            { ...mockCheckin, category: 'First Category' },
            { ...mockCheckin, id: '4567', category: 'Second Category' },
            { ...mockCheckin, id: '1234', category: 'First Category' },
        ]

        render(<Monthly checkins={checkins} month={0} onMonthChange={jest.fn} />)

        const categories = screen.getAllByTestId('category')
        getByText(categories[0], 'First Category')
        getByText(categories[0], '2 times')
        getByText(categories[1], 'Second Category')
        getByText(categories[1], '1 time')
    })

    it('should display previous icon and no next icon if current month', () => {
        render(<Monthly checkins={[mockCheckin]} month={0} onMonthChange={jest.fn} />)
        screen.getByTestId('prev-month')
        expect(screen.queryByTestId('next-month')).not.toBeInTheDocument()
    })

    it('should change months when clicking the previous icon', async () => {
        let onMonthChange = jest.fn()
        render(<Monthly checkins={[mockCheckin]} month={0} onMonthChange={onMonthChange} />)
        screen.getByRole('heading', { name: format(new Date(), 'MMMM yyyy') })
        const prev = screen.getByTestId('prev-month')
        userEvent.click(prev)
        expect(onMonthChange).toHaveBeenCalled()
    })

    it('should display previous icon and next icon if previous month', () => {
        render(<Monthly checkins={[mockCheckin]} month={1} onMonthChange={jest.fn} />)
        screen.getByTestId('prev-month')
        screen.getByTestId('next-month')
    })

    it('should change months when clicking the next icon', async () => {
        let onMonthChange = jest.fn()
        render(<Monthly checkins={[mockCheckin]} month={1} onMonthChange={onMonthChange} />)
        const next = screen.getByTestId('next-month')
        userEvent.click(next)
        expect(onMonthChange).toHaveBeenCalled()
    })
})
