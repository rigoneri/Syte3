import '@testing-library/jest-dom/extend-expect'
require('jest-fetch-mock').enableMocks()

jest.mock('react-image', () => {
    return {
        __esModule: true,
        default: props => {
            return <img {...props} />
        },
    }
})

global.requestAnimationFrame = callback => {
    return callback()
}
