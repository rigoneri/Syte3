import React from 'react'
import { shallow, mount } from 'enzyme'
import { mockTweet } from './Tweet.tests'
import { TimelineItem } from '../TimelineItem'

it('should display a tweet', () => {
    const component = shallow(<TimelineItem item={mockTweet} />)
    expect(component.find('Img[alt="Avatar"]').exists()).toEqual(true)
    expect(component.find('p').exists()).toEqual(true)
    expect(component.find('.pictures').exists()).toEqual(true)
})

it('should display pictures', () => {
    let tweet = { ...mockTweet }
    delete tweet['video']

    const component = shallow(<TimelineItem item={tweet} />)
    expect(component.find('.pictures').exists()).toEqual(true)
    expect(component.find('.video').exists()).toEqual(false)
})

it('should display videos', () => {
    const component = shallow(<TimelineItem item={mockTweet} />)
    expect(component.find('.pictures').exists()).toEqual(true)
    expect(component.find('.video').exists()).toEqual(true)
})

it('should not display pictures or videos if not in tweet', () => {
    let tweet = { ...mockTweet }
    delete tweet['video']
    delete tweet['pictures']

    const component = shallow(<TimelineItem item={tweet} />)
    expect(component.find('.pictures').exists()).toEqual(false)
    expect(component.find('.video').exists()).toEqual(false)
})

it('should show a modal when clicking the twitter picture', () => {
    const modalMount = global.document.createElement('div')
    modalMount.setAttribute('id', 'modal-mount')
    global.document.querySelector('body').appendChild(modalMount)

    const tweet = { ...mockTweet, video: null }
    const component = mount(<TimelineItem item={tweet} />)
    expect(component.find('Modal').exists()).toEqual(false)
    component.find('ul li').simulate('click')
    expect(component.find('Modal').exists()).toEqual(true)
    component.unmount()
})
