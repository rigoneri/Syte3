import React from 'react'
import { shallow } from 'enzyme'
import { TimelineItem } from '../TimelineItem'

const mockItem = {
    id: '10710843773',
    date: '2019-10-25T03:53:59.000Z',
    type: 'github',
    repo_id: 214762600,
    repo: 'rigoneri/Syte3',
    repo_url: 'https://github.com/rigoneri/Syte3',
    commits: 2,
}

it('should display github commits', () => {
    const component = shallow(<TimelineItem item={mockItem} />)
    expect(component.find('p').text()).toEqual('Pushed 2 commits to rigoneri/Syte3 on Github.')
})

it('should display github commits on a private repo', () => {
    let privateItem = { ...mockItem, repo: null }
    const component = shallow(<TimelineItem item={privateItem} />)
    expect(component.find('p').text()).toEqual('Pushed 2 commits to a private repo on Github.')
})

it('should display a single github commit', () => {
    let privateItem = { ...mockItem, commits: 1 }
    const component = shallow(<TimelineItem item={privateItem} />)
    expect(component.find('p').text()).toEqual('Pushed 1 commit to rigoneri/Syte3 on Github.')
})
