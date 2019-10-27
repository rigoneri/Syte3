import React, { Suspense } from 'react'
import { BrowserRouter, Switch, Route, useLocation } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import Header from 'components/Header'
import { ModalMount } from 'components/Modal'
import './App.css'

const Home = React.lazy(() => import('./pages/Home'))
const Twitter = React.lazy(() => import('./pages/Twitter'))
const Dribbble = React.lazy(() => import('./pages/Dribbble'))
const Foursquare = React.lazy(() => import('./pages/Foursquare'))
const Github = React.lazy(() => import('./pages/Github'))
const Instagram = React.lazy(() => import('./pages/Instagram'))
const Spotify = React.lazy(() => import('./pages/Spotify'))
const YouTube = React.lazy(() => import('./pages/YouTube'))

function App() {
    return (
        <BrowserRouter>
            <div className="app">
                <Header />
                <AppContent />
            </div>
            <ModalMount />
        </BrowserRouter>
    )
}

function AppContent() {
    let location = useLocation()

    return (
        <TransitionGroup className="app-content">
            <CSSTransition key={location.key} classNames="fade" timeout={{ enter: 2000, exit: 400 }}>
                <section className="routes">
                    <Suspense fallback={null}>
                        <Routes location={location} />
                    </Suspense>
                </section>
            </CSSTransition>
        </TransitionGroup>
    )
}

function Routes({ location }) {
    return (
        <Switch location={location}>
            <Route exact path="/">
                <Home />
            </Route>
            <Route path="/twitter">
                <Twitter />
            </Route>
            <Route path="/dribbble">
                <Dribbble />
            </Route>
            <Route path="/foursquare">
                <Foursquare />
            </Route>
            <Route path="/github">
                <Github />
            </Route>
            <Route path="/instagram">
                <Instagram />
            </Route>
            <Route path="/spotify">
                <Spotify />
            </Route>
            <Route path="/youtube">
                <YouTube />
            </Route>
        </Switch>
    )
}

export default App
