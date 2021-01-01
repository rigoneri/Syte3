import React, { Suspense } from 'react'
import { BrowserRouter, Switch, Route, useLocation } from 'react-router-dom'
import { Location } from 'history'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import Header from 'components/Header'
import { ModalMount } from 'components/Modal'
import Error from 'components/Error'
import Login from './pages/Admin/Login'
import { isAuthed } from './utils'
import './App.css'

const Home = React.lazy(() => import('./pages/Home'))
const Admin = React.lazy(() => import('./pages/Admin'))
const Twitter = React.lazy(() => import('./pages/Twitter'))
const Dribbble = React.lazy(() => import('./pages/Dribbble'))
const Foursquare = React.lazy(() => import('./pages/Foursquare'))
const Github = React.lazy(() => import('./pages/Github'))
const Instagram = React.lazy(() => import('./pages/Instagram'))
const Spotify = React.lazy(() => import('./pages/Spotify'))
const YouTube = React.lazy(() => import('./pages/YouTube'))

const App = () => {
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

const AppContent = () => {
    let location = useLocation()

    return (
        <TransitionGroup className="app-content">
            <CSSTransition
                key={location.key}
                classNames="fade"
                timeout={{ enter: 2000, exit: 400 }}
                onExited={() => {
                    window.scrollTo(0, 0)
                }}>
                <section className="routes">
                    <Suspense fallback={null}>
                        <Routes location={location} />
                    </Suspense>
                </section>
            </CSSTransition>
        </TransitionGroup>
    )
}

type RoutesProps = {
    location: Location
}

const Routes = ({ location }: RoutesProps) => {
    return (
        <Switch location={location}>
            <Route exact path="/">
                <Home />
            </Route>
            {isAuthed() ? (
                <Route path="/admin/:service?">
                    <Admin />
                </Route>
            ) : (
                <Route path="/admin">
                    <Login />
                </Route>
            )}
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
            <Route>
                <Error message="Page Not Found" />
            </Route>
        </Switch>
    )
}

export default App
