import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Home, Twitter, Dribbble, Foursquare, Github, Instagram, Spotify, YouTube } from './pages'
import Header from './components/Header'
import './App.css'

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Header />
                <div className="AppContent">
                    <Switch>
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
                </div>
            </div>
        </BrowserRouter>
    )
}

export default App
