import { __ } from '@wordpress/i18n';

import { ErrorState, ErrorStateDescription } from '@/components/error-state';
import { Page, PageContent, PageHeader } from '@/components/layouts/page';

const NotFoundPage = () => {
  return (
    <Page>
      <PageHeader variant="fluid" />
      <PageContent>
        <ErrorState className="gf-mt-10">
          <ErrorStateDescription className="gf-flex gf-flex-col gf-items-center">
            <div className="gf-typo-h1">{__('404', 'growfund')}</div>
            <div>{__('Page not found.', 'growfund')}</div>
          </ErrorStateDescription>
        </ErrorState>
      </PageContent>
    </Page>
  );
};

export default NotFoundPage;
