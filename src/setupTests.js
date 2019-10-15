import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

global.requestAnimationFrame = callback => {
    return setTimeout(callback, 0)
}

configure({ adapter: new Adapter() })
