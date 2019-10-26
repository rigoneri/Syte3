import React from 'react'
import { Icon } from 'components/Icons'
import styles from './Home.module.css'
import { TimelineItem as SpotifyItem } from 'pages/Spotify/TimelineItem'
import { TimelineItem as TwitterItem } from 'pages/Twitter/TimelineItem'
import { TimelineItem as GithubItem } from 'pages/Github/TimelineItem'
import { TimelineItem as FoursquareItem } from 'pages/Foursquare/TimelineItem'
import { TimelineItem as InstagramItem } from 'pages/Instagram/TimelineItem'
import { TimelineItem as DribbbleItem } from 'pages/Dribbble/TimelineItem'
import { TimelineItem as YouTubeItem } from 'pages/YouTube/TimelineItem'

export default function TimelineItem({ item }) {
    const renderItem = () => {
        switch (item.type) {
            case 'spotify':
            case 'lastfm':
                return <SpotifyItem item={item} />
            case 'twitter':
                return <TwitterItem item={item} />
            case 'github':
                return <GithubItem item={item} />
            case 'foursquare':
                return <FoursquareItem item={item} />
            case 'instagram':
                return <InstagramItem item={item} />
            case 'dribbble':
                return <DribbbleItem item={item} />
            case 'youtube':
                return <YouTubeItem item={item} />
            default:
                return <span>content...</span>
        }
    }

    return (
        <li>
            {!['lastfm', 'spotify'].includes(item.type) ? <h3>{item.time}</h3> : null}
            <span className={styles.icon}>
                <Icon type={item.type} />
            </span>
            <div className={styles.content}>{renderItem()}</div>
        </li>
    )
}
