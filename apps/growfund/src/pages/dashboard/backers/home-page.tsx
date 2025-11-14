import { __ } from '@wordpress/i18n';

import { Container } from '@/components/layouts/container';

const BackerHomePage = () => {
  return (
    <Container className="gf-mt-10">
      <h1 className="gf-typo-h1">{__('Home Page', 'growfund')}</h1>
    </Container>
  );
};

export default BackerHomePage;
