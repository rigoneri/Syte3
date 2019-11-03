import React from 'react'
import { shallow } from 'enzyme'
import { mockActivity } from './RecentActivity.tests'
import Activity from '../Activity'

it('should display a crunchyroll activity', () => {
    const component = shallow(<Activity activity={mockActivity} />)
    expect(component.find('a').exists()).toEqual(true)
    expect(component.find('Img').exists()).toEqual(true)
    expect(component.find('h4').exists()).toEqual(true)
    expect(component.find('.description').exists()).toEqual(true)
    expect(component.find('.date').exists()).toEqual(true)
})

it('should display a date formatted from now', () => {
    let now = new Date()
    now.setDate(now.getDate() - 1)

    let component = shallow(<Activity activity={{ ...mockActivity, date: now.toISOString() }} />)
    expect(component.find('.date').text()).toEqual('1 day ago')

    now.setDate(now.getDate() - 30)
    component = shallow(<Activity activity={{ ...mockActivity, date: now.toISOString() }} />)
    expect(component.find('.date').text()).toEqual('about 1 month ago')
})
