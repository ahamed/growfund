import { __ } from '@wordpress/i18n';

import { FundraiserEmptyStateIcon } from '@/app/icons';
import { Container } from '@/components/layouts/container';
import { Page, PageContent, PageHeader } from '@/components/layouts/page';
import { Card, CardContent } from '@/components/ui/card';
import { ProButton } from '@/components/ui/pro-button';

const FundraisersFallback = () => {
  return (
    <Page>
      <PageHeader name={__('Fundraisers', 'growfund')} />

      <PageContent>
        <Container size="xs" className="gf-my-10">
          <Card className="gf-bg-background-surface gf-border-border">
            <CardContent className="gf-flex gf-flex-col gf-items-center gf-gap-6 gf-justify-center gf-py-8 gf-px-6">
              <FundraiserEmptyStateIcon />
              <div className="gf-flex gf-flex-col gf-gap-2">
                <h4 className="gf-typo-h4 gf-text-fg-primary gf-text-center">
                  {__('Supercharge fundraising with collaboration', 'growfund')}
                </h4>
                <div className="gf-typo-small gf-text-fg-secondary gf-text-center">
                  {__(
                    'Pro enables collaboration and the creation of multiple fundraisers.',
                    'growfund',
                  )}
                </div>
              </div>
              <ProButton />
            </CardContent>
          </Card>
        </Container>
      </PageContent>
    </Page>
  );
};

export default FundraisersFallback;
