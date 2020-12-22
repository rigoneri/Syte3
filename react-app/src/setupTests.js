import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
//TODO: remove enzyme later

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

configure({ adapter: new Adapter() })
