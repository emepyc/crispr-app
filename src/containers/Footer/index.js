import React from 'react';
import { NavLink } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import './footer.css';

function Footer() {
  const linkStyle = {
    color: 'white'
  };

  return (
    <Row
      style={{
        paddingLeft: '10%',
        paddingRight: '10%',
        marginTop: '40px',
        backgroundColor: '#469d32',
        color: 'white'
      }}
      className="footer"
    >
      <Col xs={12} lg={3}>
        <div className="footer-header">
          <b>Project SCORE</b>
        </div>
        <NavLink to="/about-us" style={linkStyle} activeStyle={linkStyle}>
          <div className="footer-item">About</div>
        </NavLink>
        <NavLink to="/download" style={linkStyle} activeStyle={linkStyle}>
          <div className="footer-item">Download</div>
        </NavLink>
        <div className="footer-item">Version 1.0</div>
      </Col>
      <Col xs={12} lg={3}>
        <div className="footer-header">
          <b>DepMap | Programmes</b>
        </div>
        <a
          target="_blank"
          href="https://depmap.sanger.ac.uk/programmes#drugs"
          style={linkStyle}
        >
          <div className="footer-item">DepMap | Drugs</div>
        </a>
        <a
          target="_blank"
          href="https://depmap.sanger.ac.uk/programmes#cmp"
          style={linkStyle}
        >
          <div className="footer-item">DepMap | Models</div>
        </a>
        <a
          target="_blank"
          href="https://depmap.sanger.ac.uk/programmes#analytics"
          style={linkStyle}
        >
          <div className="footer-item">DepMap | Analytics</div>
        </a>
      </Col>
      <Col xs={12} lg={3}>
        <div className="footer-header">
          <b>Collaborators</b>
        </div>
        <a
          target="_blank"
          href="https://www.broadinstitute.org/cancer/cancer-dependency-map"
          style={linkStyle}
        >
          <div className="footer-item">
            Broad Institute Cancer Dependency Map
          </div>
        </a>
        <a target="_blank" href="https://www.opentargets.org" style={linkStyle}>
          <div className="footer-item">Open Targets</div>
        </a>
        <a
          target="_blank"
          href="https://ocg.cancer.gov/programs/HCMI"
          style={linkStyle}
        >
          <div className="footer-item">Human Cancer Models Initiative</div>
        </a>
        <a target="_blank" href="https://www.nki.nl/" style={linkStyle}>
          <div className="footer-item">Netherlands Cancer Institute</div>
        </a>
      </Col>
      <Col xs={12} lg={3}>
        <div className="footer-header">
          <b>Contact</b>
        </div>
        <a target="_blank" href="mailto:depmap@sanger.ac.uk" style={linkStyle}>
          <div className="footer-item">depmap@sanger.ac.uk</div>
        </a>
        <div className="footer-item" style={{ lineHeight: '1em' }}>
          Wellcome Sanger Institute<br />
          Wellcome Genome Campus<br />
          Hinxton, Cambridgeshire<br />
          CB10 1SA, UK<br />
        </div>
      </Col>
    </Row>
  );
}

export default Footer;
