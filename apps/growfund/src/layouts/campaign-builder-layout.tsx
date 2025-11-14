import { zodResolver } from '@hookform/resolvers/zod';
import { __ } from '@wordpress/i18n';
import { SquareArrowOutUpRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Outlet, useNavigate } from 'react-router';

import { CampaignEmptyStateIcon } from '@/app/icons';
import { EmptyState, EmptyStateDescription } from '@/components/empty-state';
import { ErrorState, ErrorStateDescription } from '@/components/error-state';
import { LoadingSpinnerOverlay } from '@/components/layouts/loading-spinner';
import { Page, PageContent, PageHeader } from '@/components/layouts/page';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { RouteConfig } from '@/config/route-config';
import CampaignNavigation from '@/features/campaigns/components/campaign-navigation';
import CampaignPublishedDialog from '@/features/campaigns/components/dialogs/campaign-published-dialog';
import CampaignSubmittedForReviewDialog from '@/features/campaigns/components/dialogs/campaign-submitted-for-review-dialog';
import {
  CampaignBuilderContextProvider,
  useCampaignBuilderContext,
} from '@/features/campaigns/contexts/campaign-builder';
import {
  CampaignBuilderFormSchema,
  type CampaignBuilderForm,
} from '@/features/campaigns/schemas/campaign';
import {
  useCampaignDetailsQuery,
  useUpdateCampaignMutation,
} from '@/features/campaigns/services/campaign';
import { checkErrorOn } from '@/features/campaigns/utils/utils';
import useCurrentUser from '@/hooks/use-current-user';
import { useFormErrorHandler } from '@/hooks/use-form-error-handler';
import { useRouteParams } from '@/hooks/use-route-params';
import { useManageWordpressLayout } from '@/hooks/use-wp-layout';
import { isDefined } from '@/utils';
import { matchQueryStatus } from '@/utils/match-query-status';

const CampaignBuilderLayoutContent = () => {
  const { isFundraiser } = useCurrentUser();
  const [isPublished, setIsPublished] = useState(false);
  const [isSubmittedForReview, setIsSubmittedForReview] = useState(false);
  const [clickedOn, setClickedOn] = useState<'publish' | 'draft' | null>(null);
  const navigate = useNavigate();
  const { id } = useRouteParams(RouteConfig.CampaignBuilder);

  const form = useForm<CampaignBuilderForm>({
    resolver: zodResolver(CampaignBuilderFormSchema),
  });

  const { hideWordpressLayout, showWordpressLayout } = useManageWordpressLayout();
  const { createErrorHandler } = useFormErrorHandler(form);

  const { setErrorOn, activeStep } = useCampaignBuilderContext();

  const campaignDetailsQuery = useCampaignDetailsQuery(id);
  const updateCampaignMutation = useUpdateCampaignMutation();

  const campaign = useMemo(() => {
    return campaignDetailsQuery.data;
  }, [campaignDetailsQuery.data]);

  useEffect(() => {
    if (campaign) {
      form.reset.call(null, campaign);
    }
  }, [campaign, form.reset]);

  useEffect(() => {
    hideWordpressLayout();
    return () => {
      showWordpressLayout();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const errors = form.formState.errors;

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const errorOn = checkErrorOn(errors as unknown as Record<string, string[]>);

      setErrorOn?.(errorOn.filter((step) => step !== activeStep));
    }
  }, [errors, activeStep, setErrorOn]);

  const isCampaignActive = useMemo(() => {
    return campaign?.status && ['published', 'funded', 'completed'].includes(campaign.status);
  }, [campaign?.status]);

  const onSubmit = (values: CampaignBuilderForm, status: 'draft' | 'published' | null) => {
    updateCampaignMutation.mutate(
      {
        ...values,
        ...(isDefined(status) && { status }),
      },
      {
        onError: (error) => {
          const errorOn = checkErrorOn(
            (error as unknown as { errors: Record<string, string[]> }).errors,
          );

          setErrorOn?.(errorOn.filter((step) => step !== activeStep));

          return createErrorHandler()(error);
        },
        onSuccess: () => {
          if (status === 'published') {
            if (isFundraiser) {
              setIsSubmittedForReview(true);
              return;
            }

            if (!isCampaignActive) {
              setIsPublished(true);
              return;
            }
          }
        },
      },
    );
  };

  return matchQueryStatus(campaignDetailsQuery, {
    Loading: <LoadingSpinnerOverlay />,
    Error: (
      <ErrorState className="gf-mt-10">
        <ErrorStateDescription>
          <CampaignEmptyStateIcon />
          <div>{__('Campaign not found.', 'growfund')}</div>
        </ErrorStateDescription>
      </ErrorState>
    ),
    Empty: (
      <EmptyState className="gf-mt-10">
        <EmptyStateDescription className="gf-flex gf-flex-col gf-items-center">
          <CampaignEmptyStateIcon />
          <div>{__('Campaign not found.', 'growfund')}</div>
        </EmptyStateDescription>
      </EmptyState>
    ),
    Success: (response) => (
      <Page>
        <Form {...form}>
          <div>
            <PageHeader
              name={__('Edit Campaign', 'growfund')}
              onGoBack={() => void navigate(RouteConfig.Campaigns.buildLink())}
              variant="fluid"
              action={
                <div className="gf-flex gf-items-center gf-gap-3">
                  {response.data.preview_url && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        if (response.data.preview_url) {
                          window.open(response.data.preview_url, '_blank');
                        }
                      }}
                    >
                      {__('Preview', 'growfund')}
                      <SquareArrowOutUpRight />
                    </Button>
                  )}

                  {!isCampaignActive && (
                    <Button
                      variant="outline"
                      onClick={form.handleSubmit(
                        (values) => {
                          setClickedOn('draft');
                          onSubmit(values, 'draft');
                        },
                        (error) => {
                          console.error(error);
                        },
                      )}
                      disabled={updateCampaignMutation.isPending}
                      loading={updateCampaignMutation.isPending && clickedOn === 'draft'}
                    >
                      {__('Save as Draft', 'growfund')}
                    </Button>
                  )}
                  <Button
                    onClick={form.handleSubmit(
                      (values) => {
                        setClickedOn('publish');
                        onSubmit(values, !isCampaignActive ? 'published' : null);
                      },
                      (errors) => {
                        console.error(errors);
                      },
                    )}
                    loading={updateCampaignMutation.isPending && clickedOn === 'publish'}
                    disabled={updateCampaignMutation.isPending}
                  >
                    {isCampaignActive ? __('Save Changes', 'growfund') : __('Publish', 'growfund')}
                  </Button>
                </div>
              }
            >
              <CampaignNavigation />
            </PageHeader>
            <PageContent className="gf-mt-10">
              <Outlet />
            </PageContent>
          </div>
        </Form>
        <CampaignPublishedDialog
          open={isPublished}
          onOpenChange={setIsPublished}
          url={response.data.preview_url ?? ''}
        />
        <CampaignSubmittedForReviewDialog
          open={isSubmittedForReview}
          onOpenChange={setIsSubmittedForReview}
        />
      </Page>
    ),
  });
};

const CampaignBuilderLayout = () => {
  return (
    <CampaignBuilderContextProvider>
      <CampaignBuilderLayoutContent />
    </CampaignBuilderContextProvider>
  );
};

export default CampaignBuilderLayout;
