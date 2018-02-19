import React from 'react';
import { Route } from 'react-router-dom';
import Masthead from '../masthead/';
import Home from '../home';
import About from '../about';
import Downloads from '../downloads';

const App = () => (
  <div>
    <Masthead />

    {/*<header>*/}
      {/*<Link to="/">Home</Link>*/}
      {/*<Link to="/about-us">About</Link>*/}
      {/*<Link to="/downloads">Downloads</Link>*/}
    {/*</header>*/}

    <main>
      <Route exact path="/" component={Home} />
      <Route exact path="/about-us" component={About} />
      <Route exact path="/downloads" component={Downloads} />
    </main>
  </div>
);

export default App;
