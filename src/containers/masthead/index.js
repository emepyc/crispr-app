import React from 'react';
import cancer_dep_map from './DependencyMapLogo.png';
import { NavLink } from 'react-router-dom';
import mastheadCss from './masthead.css';

const Masthead = () => {
  return (
    <nav className="navbar-expand-lg navbar-dark bg-dark navbar">
      <div className="container">
        <a href="http://www.sanger.ac.uk/" className="navbar-brand">
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMkAAAA5CAMAAACriv8uAAADAFBMVEX///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+/LkhhAAAA/3RSTlMAAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1O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" width="201" height="57" className="d-inline-block align-top" alt=""/>
        </a>
        <a href="https://depmap.sanger.ac.uk/" className="ml-3 navbar-brand">
          <img src={cancer_dep_map} alt="Cancer Dependency Map" width="201" height="57" className="d-inline-block align-top"/>
        </a>

        <div className="depmap-genes my-auto">
          <a href="/">DepMap <span className="col-genes"> | </span>Genes</a>
        </div>

        {/*<div className="w-100 d-sm-none">*/}
        {/*</div>*/}

        <div className="ml-md-1 my-auto">
          <header className="navbar-nav">
            <NavLink to="/" activeClassName="active" exact className="ml-md-3 nav-item nav-link">Home</NavLink>
            <NavLink to="/about-us" activeClassName="active" className="ml-md-1 nav-item nav-link">About</NavLink>
            <NavLink to="/downloads" activeClassName="active" className="ml-md-1 nav-item nav-link">Downloads</NavLink>
          </header>
        </div>

        {/*<div className="ml-md-auto mt-md-2">*/}
          {/*<ul className="navbar-nav">*/}
            {/*<li className="ml-md-5 nav-item"><a className="nav-link" aria-current="false" href="/">Home</a></li>*/}
            {/*<li className="ml-md-5 nav-item"><a className="nav-link active" aria-current="true"*/}
                                            {/*href="/programmes">Programmes</a></li>*/}
            {/*<li className="ml-md-5 nav-item"><a className="nav-link" aria-current="false" href="/contributors">Contributors</a>*/}
            {/*</li>*/}
          {/*</ul>*/}
        {/*</div>*/}

      </div>
    </nav>
  )
};

export default Masthead;
