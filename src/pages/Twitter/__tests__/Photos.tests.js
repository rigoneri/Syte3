import React from 'react'
import { shallow } from 'enzyme'
import Photos from '../Photos'

it('should display a list of photos', () => {
    const photos = [
        {
            id: 'photo-1',
            tweetID: 'tweet-id-1',
            url: 'https://pbs.twimg.com/photo-1.png',
            width: 500,
            height: 500,
        },
        {
            id: 'photo-2',
            tweetID: 'tweet-id-2',
            url: 'https://pbs.twimg.com/photo-2.png',
            width: 500,
            height: 500,
        },
    ]
    const component = shallow(<Photos username="syte" photos={photos} />)
    expect(component.find('h3').exists()).toEqual(true)
    expect(
        component
            .find('li')
            .at(0)
            .key()
    ).toEqual('photo-1')
    expect(
        component
            .find('li')
            .at(1)
            .key()
    ).toEqual('photo-2')
})

it('should not display if there are no photos', () => {
    const component = shallow(<Photos username="syte" photos={[]} />)
    expect(component.find('h3').exists()).toEqual(false)
})
