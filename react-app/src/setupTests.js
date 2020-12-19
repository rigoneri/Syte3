import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
//TODO: remove enzyme later

import '@testing-library/jest-dom/extend-expect'
require('jest-fetch-mock').enableMocks()

global.requestAnimationFrame = callback => {
    return callback()
}

configure({ adapter: new Adapter() })
