import React from 'react';
import { Container } from 'reactstrap';
import Searchbox from '../searchbox';
import DepmapGenesHeader from '../depmapGenesHeader';
import HomeProjectDescription from '../HomeProjectDescription';
import HomeProgrammeDescription from '../HomeProgrammeDescription';
import HomeSection from '../homeSection';
import TissuesSummary from '../tissuesSummary';

const Home = () => (
  <Container>
    <HomeSection>
      <DepmapGenesHeader className="text-center" />
      <Searchbox />
    </HomeSection>

    <HomeSection>
      <TissuesSummary />
    </HomeSection>

    <HomeSection>
      <HomeProjectDescription />
    </HomeSection>

    <HomeSection>
      <HomeProgrammeDescription />
    </HomeSection>
  </Container>
);

export default Home;
