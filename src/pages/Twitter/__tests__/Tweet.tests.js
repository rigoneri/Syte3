import React from 'react'
import { shallow, mount } from 'enzyme'
import Tweet from '../Tweet'

export const mockTweet = {
    id: 'tweet-1',
    date: '2019-10-14T02:25:32.000Z',
    type: 'twitter',
    text: 'RT <a href="https://twitter.com/rigoneri" target="_blank">@rigoneri</a>: Testing something...',
    video: 'https://video.twimg.com/test-video',
    pictures: [
        {
            id: 'pic-1',
            url: 'https://pbs.twimg.com/test-pic.jpg',
            width: 360,
            height: 360,
        },
    ],
    url: 'https://www.twitter.com/rigoneri/status/test-123',
    favorites: 0,
    retweets: 2,
    user: {
        username: 'rigoneri',
        name: 'Rigo Neri',
        picture: 'https://pbs.twimg.com/test-profile-pic.jpg',
        id: 'user-1',
    },
    originalText: 'Testing something...',
}

describe('Tweet', () => {
    it('should display a tweet', () => {
        const component = shallow(<Tweet tweet={mockTweet} />)
        expect(component.find('Img[alt="Avatar"]').exists()).toEqual(true)
        expect(component.find('h4').exists()).toEqual(true)
        expect(component.find('.username').exists()).toEqual(true)
        expect(component.find('.date').exists()).toEqual(true)
        expect(component.find('p').exists()).toEqual(true)
        expect(component.find('.pictures').exists()).toEqual(true)
    })

    it('should display a date formatted from now', () => {
        let now = new Date()
        now.setDate(now.getDate() - 1)

        let component = shallow(<Tweet tweet={{ ...mockTweet, date: now.toISOString() }} />)
        expect(component.find('.date').text()).toEqual('1 day ago')

        now.setDate(now.getDate() - 30)
        component = shallow(<Tweet tweet={{ ...mockTweet, date: now.toISOString() }} />)
        expect(component.find('.date').text()).toEqual('about 1 month ago')
    })

    it('should display pictures', () => {
        let tweet = { ...mockTweet }
        delete tweet['video']

        const component = shallow(<Tweet tweet={tweet} />)
        expect(component.find('.pictures').exists()).toEqual(true)
        expect(component.find('.video').exists()).toEqual(false)
    })

    it('should display videos', () => {
        const component = shallow(<Tweet tweet={mockTweet} />)
        expect(component.find('.pictures').exists()).toEqual(true)
        expect(component.find('.video').exists()).toEqual(true)
    })

    it('should not display pictures or videos if not in tweet', () => {
        let tweet = { ...mockTweet }
        delete tweet['video']
        delete tweet['pictures']

        const component = shallow(<Tweet tweet={tweet} />)
        expect(component.find('.pictures').exists()).toEqual(false)
        expect(component.find('.video').exists()).toEqual(false)
    })

    it('should show a modal when clicking the twitter picture', () => {
        const modalMount = global.document.createElement('div')
        modalMount.setAttribute('id', 'modal-mount')
        global.document.querySelector('body').appendChild(modalMount)

        const tweet = { ...mockTweet, video: null }
        const component = mount(<Tweet tweet={tweet} />)
        expect(component.find('Modal').exists()).toEqual(false)
        component.find('ul li').simulate('click')
        expect(component.find('Modal').exists()).toEqual(true)
        component.unmount()
    })
})
