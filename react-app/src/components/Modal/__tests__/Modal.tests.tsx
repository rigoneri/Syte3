import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from '../index'

describe('Modal', () => {
    const modalMount = global.document.createElement('div')
    modalMount.setAttribute('id', 'modal-mount')

    const MockChild = () => <div>mock child</div>

    beforeEach(() => {
        document.body.appendChild(modalMount)
    })
    afterEach(() => {
        document.body.removeChild(modalMount)
    })

    it('should render a modal', () => {
        render(
            <Modal onClose={jest.fn()}>
                <MockChild />
            </Modal>
        )

        screen.getByRole('dialog')
        screen.getByRole('document')
        screen.getByText('mock child')
        screen.getByLabelText('Close Modal', { selector: 'button' })
    })

    it('should close the modal when overlay is clicked', () => {
        const handleClose = jest.fn()
        render(
            <Modal onClose={handleClose}>
                <MockChild />
            </Modal>
        )
        const overlay = screen.getByRole('dialog')
        userEvent.click(overlay)
        expect(handleClose).toHaveBeenCalledTimes(1)
    })

    it('should mount the modal in the expected location', () => {
        expect(modalMount.hasChildNodes()).toEqual(false)
        render(
            <Modal onClose={jest.fn()}>
                <MockChild />
            </Modal>
        )
        expect(modalMount.hasChildNodes()).toEqual(true)
    })
})
