import React from 'react'
import { createPortal } from 'react-dom'
import styles from './Modal.module.css'

interface ModalProps {
    id?: string
    children: React.ReactNode
    onClose(): void
    wide?: boolean
}

export default function Modal({ id = 'modal-mount', children, onClose, wide }: ModalProps) {
    const el = document.getElementById(id) as HTMLElement

    return createPortal(
        <div className={styles.overlay} onClick={onClose} role="dialog">
            <div
                className={`${styles.content} ${wide ? styles.wide : ''}`}
                onClick={e => e.stopPropagation()}
                role="document">
                {children}
            </div>
            <button className={styles.close} onClick={onClose} aria-label="Close Modal">
                ✕
            </button>
        </div>,
        el
    )
}

export function ModalMount() {
    return <aside id="modal-mount" className={styles.modal} />
}
