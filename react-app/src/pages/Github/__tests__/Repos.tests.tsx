import React from 'react'
import { render, screen } from '@testing-library/react'
import Repos from '../Repos'

const mockRepo: Repo = {
    id: 12345,
    name: 'Repo',
    url: 'https://github.com/some/repo',
    updated: '2019-09-30T14:08:47Z',
    description: 'Some repo',
    language: 'JavaScript',
    forks: 56,
    favorites: 187,
}

it('should display a list of repos', async () => {
    render(<Repos repos={[mockRepo]} />)
    screen.getByRole('heading', { name: 'Repositories' })
    expect(screen.getByRole('link')).toHaveAttribute('href', mockRepo.url)
    expect(screen.getByRole('link').textContent).toEqual(mockRepo.name)
    screen.getByText(mockRepo.description!)
    screen.getByText(mockRepo.language)
})
