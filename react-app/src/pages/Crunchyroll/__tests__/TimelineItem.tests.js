import React from 'react'
import { shallow, mount } from 'enzyme'
import { mockActivity } from './RecentActivity.tests'
import { TimelineItem } from '../TimelineItem'

it('should display a crunchyroll activity', () => {
    const component = shallow(<TimelineItem item={mockActivity} />)
    expect(component.find('a').exists()).toEqual(true)
    expect(component.find('.picture').exists()).toEqual(true)
    expect(
        component
            .find('p')
            .first()
            .text()
    ).toEqual(`Watched ${mockActivity.title} on Crunchyroll.`)
    expect(component.find('.description').exists()).toEqual(true)
    expect(component.find('.description').text()).toEqual(mockActivity.description)
    expect(component.find('.date').exists()).toEqual(false)
})
