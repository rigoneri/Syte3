import React from 'react'
import { render, screen } from '@testing-library/react'
import { TimelineItem } from '../TimelineItem'
import { mockActivity } from './Activities.tests'

it('should display github commits', () => {
    render(<TimelineItem item={mockActivity} />)
    expect(screen.getByText(/Pushed/).textContent).toEqual('Pushed 1 commit to master at rigoneri/Syte3')
})
