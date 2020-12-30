import React from 'react'
import App from './App'
import { render, screen } from '@testing-library/react'

it('renders without crashing', () => {
    render(<App />)
    screen.getByRole('heading')
    screen.getByRole('navigation')
})
