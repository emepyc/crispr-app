import React from 'react';
import { Route } from 'react-router-dom';

import About from '../about';
import Downloads from '../downloadPage';
import Footer from '../Footer';
import Gene from '../genePage';
import Home from '../home';
import Masthead from '../masthead/';
import Model from '../modelPage';
import Table from '../tablePage';

const App = () => (
  <div>
    <Masthead />

    <main>
      <Route exact path="/" component={Home} />
      <Route exact path="/about-us" component={About} />
      <Route exact path="/downloads" component={Downloads} />
      <Route path="/gene" component={Gene} />
      <Route path="/model" component={Model} />
      <Route path="/table" component={Table} />
    </main>

    <Footer />
  </div>
);

export default App;
