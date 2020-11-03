import React from 'react'
import { mount } from 'enzyme'
import Repos from '../Repos'

const mockRepo = {
    id: '12345',
    name: 'Repo',
    url: 'https://github.com/some/repo',
    updated: '2019-09-30T14:08:47Z',
    description: 'Some repo',
    language: 'JavaScript',
    forks: 56,
    favorites: 187,
}

describe('Github', () => {
    it('should display a list of repos', async () => {
        let component = mount(<Repos repos={[mockRepo]} />)
        expect(component.find('h3').exists()).toEqual(true)
        expect(component.find('ul').exists()).toEqual(true)
        expect(component.find('li').exists()).toEqual(true)
        expect(component.find(`a[href="${mockRepo.url}"]`).exists()).toEqual(true)
        expect(component.find('.stats').exists()).toEqual(true)
        component.unmount()
    })
})
