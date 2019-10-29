import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

global.requestAnimationFrame = callback => {
    return callback()
}

configure({ adapter: new Adapter() })
