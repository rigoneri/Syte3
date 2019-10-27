import React from 'react'
import { mount } from 'enzyme'
import Modal from '../index'

describe('Modal', () => {
    const modalMount = global.document.createElement('div')
    modalMount.setAttribute('id', 'modal-mount')
    global.document.querySelector('body').appendChild(modalMount)

    const MockChild = () => <div>mock child</div>

    it('should render a modal', () => {
        let component = mount(
            <Modal>
                <MockChild />
            </Modal>
        )

        expect(component.find('.overlay').exists()).toEqual(true)
        expect(component.find('.content').exists()).toEqual(true)
        expect(component.find('.close').exists()).toEqual(true)
        component.unmount()
    })

    it('should close the modal when overlay is clicked', () => {
        const handleClose = jest.fn()
        let component = mount(
            <Modal onClose={handleClose}>
                <MockChild />
            </Modal>
        )
        component.find('.overlay').simulate('click')
        expect(handleClose).toHaveBeenCalledTimes(1)
        component.unmount()
    })

    it('should mount the modal in the expected location', () => {
        const modalMount = global.document.getElementById('modal-mount')
        expect(modalMount.hasChildNodes()).toEqual(false)
        let component = mount(
            <Modal>
                <MockChild />
            </Modal>
        )
        expect(modalMount.hasChildNodes()).toEqual(true)
        component.unmount()
        expect(modalMount.hasChildNodes()).toEqual(false)
    })
})
