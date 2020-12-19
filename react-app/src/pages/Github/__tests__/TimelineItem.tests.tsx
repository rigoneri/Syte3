import React from 'react'
import { render, screen } from '@testing-library/react'
import { TimelineItem } from '../TimelineItem'

const mockItem = {
    id: '12345',
    icon: 'git-commit' as GitIcon,
    date: '2019-10-16T02:21:11.000Z',
    description:
        'Pushed 1 commit to <strong>master</strong> at <a href="https://github.com/rigoneri/Syte3" target="_blank">rigoneri/Syte3</a>',
    type: 'github',
}

it('should display github commits', () => {
    render(<TimelineItem item={mockItem} />)

    expect(screen.getByText(/Pushed/).textContent).toEqual('Pushed 1 commit to master at rigoneri/Syte3')
})
