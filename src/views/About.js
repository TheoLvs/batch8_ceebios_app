import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Button } from "shards-react";

import PageTitle from "./../components/common/PageTitle";

import "./About.css"
import Planet1 from "../assets/planet1.jpg"
import Planet2 from "../assets/planet2.jfif"
import Planet3 from "../assets/planet3.jpg"

const AboutView = ({  }) => (
  <Container fluid className="home-container">
    <Container className="main-content-container px-4">
    {/* Page Header */}
    <Row noGutters className="py-4">
      <Col lg="6" md="12">
        <img src={Planet1} alt="planet1" className="home-img"/>
      </Col>
      <Col lg="6" md="12" className="home-text colored-left">
        <p className="home-p" style={{textAlign:"left"}}>There are some <span className="ceebios">4 million different kinds of animals and plants</span> in the world.<br/>Discover the richness of the creatures that surrounds us, where to find them, and why each of them is unique.</p>
        <p className="home-button"><Button href="/explore">Start your exploration</Button></p>
      </Col>
    </Row>
    <Row noGutters className="py-4">
      <Col lg="6" md="12" className="home-text">
        <p className="home-p" style={{textAlign:"right"}}>“It seems to me that the natural world is the greatest source of excitement; the greatest source of visual beauty; the greatest source of intellectual interest. It is the greatest source of so much in life that makes life worth living.”<br/>― <span style={{fontSize:"14px"}}>David Attenborough</span></p>
      </Col>
      <Col lg="6" md="12" className="colored-left">
        <img src={Planet2} alt="planet2" className="home-img"/>
      </Col>
    </Row>
    <Row noGutters className="py-4">
      <Col lg="6" md="12">
        <img src={Planet3} alt="planet1" className="home-img"/>
      </Col>
      <Col lg="6" md="12" className="home-text colored-left">
        <p className="home-p" style={{textAlign:"left"}}>Platform created in collaboration between Data For Good and Ceebios.<br/>Species data from GBIF, scientific publications from Semantic Scholar Open Corpus</p>
      </Col>
    </Row> 
  </Container>
  </Container>
  // </div>

);

export default AboutView;
