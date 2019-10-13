import React from 'react'
import { BrowserRouter, Switch, Route, useLocation } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { Home, Twitter, Dribbble, Foursquare, Github, Instagram, Spotify, YouTube } from './pages'
import Header from './components/Header'
import './App.css'

function App() {
    return (
        <BrowserRouter>
            <div className="app">
                <Header />
                <AppContent />
            </div>
        </BrowserRouter>
    )
}

function AppContent() {
    let location = useLocation()

    return (
        <TransitionGroup className="app-content">
            <CSSTransition key={location.key} classNames="fade" timeout={{ enter: 2000, exit: 400 }}>
                <section className="routes">
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
                </section>
            </CSSTransition>
        </TransitionGroup>
    )
}

export default App
