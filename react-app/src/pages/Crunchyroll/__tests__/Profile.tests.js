import React from 'react'
import { shallow } from 'enzyme'
import Profile from '../Profile'
import { mockUser } from './Crunchyroll.tests'

it('should display the crunchyroll user', () => {
    const component = shallow(<Profile user={mockUser} />)
    expect(component.find('a').exists()).toEqual(true)
    expect(component.find('Img[alt="Crunchyroll Profile"]').exists()).toEqual(true)
    expect(component.find('h2').exists()).toEqual(true)
})
