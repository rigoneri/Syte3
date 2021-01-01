import React from 'react'
import { render, screen } from '@testing-library/react'
import { mockArtist } from './Top.tests'
import TopArtists from '../TopArtists'

describe('TopArtists', () => {
    it('should display a list of artists', () => {
        const artists = [mockArtist]
        render(<TopArtists artists={artists} />)
        screen.getByRole('heading', { name: 'Top Artists' })
        screen.getByAltText(mockArtist.name)
        expect(screen.getByAltText(mockArtist.name)).toHaveAttribute('src', mockArtist.image)
        expect(screen.getByRole('link', { name: mockArtist.name })).toHaveAttribute('href', mockArtist.url)
        screen.getByText('alternative rock')
    })

    it('should display not display genres if there are none', () => {
        const artists = [{ ...mockArtist, genres: [] }]

        render(<TopArtists artists={artists} />)
        screen.getByRole('heading', { name: 'Top Artists' })
        screen.getByAltText(mockArtist.name)
        expect(screen.queryByText('alternative rock')).not.toBeInTheDocument()
    })
})
