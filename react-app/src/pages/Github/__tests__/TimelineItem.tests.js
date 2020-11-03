import React from 'react'
import { mount } from 'enzyme'
import { TimelineItem } from '../TimelineItem'

const mockItem = {
    id: '12345',
    icon: 'git-commit',
    date: '2019-10-16T02:21:11.000Z',
    description:
        'Pushed 1 commit to <strong>master</strong> at <a href="https://github.com/rigoneri/Syte3" target="_blank">rigoneri/Syte3</a>',
    type: 'github',
}

it('should display github commits', () => {
    const component = mount(<TimelineItem item={mockItem} />)
    expect(component.find('p').text()).toEqual('Pushed 1 commit to master at rigoneri/Syte3')
})
