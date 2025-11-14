import { __ } from '@wordpress/i18n';
import { ArrowLeft, Check, CheckCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { NativePaymentIcon, WooCommercePaymentIcon } from '@/app/icons';
import { ComboBoxField } from '@/components/form/combobox-field';
import { Box, BoxContent } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Image } from '@/components/ui/image';
import { growfundConfig } from '@/config/growfund';
import DecisionBox from '@/features/onboarding/components/decision-box';
import { type PaymentMode, useOnboarding } from '@/features/onboarding/contexts/onboarding-context';
import {
  Screen,
  ScreenContent,
  ScreenDescription,
  ScreenFooter,
  ScreenIndicator,
  ScreenTitle,
} from '@/features/onboarding/layouts/screen';
import { cn } from '@/lib/utils';
import { isDefined } from '@/utils';
import { countriesAsOptions, getCountryByCode } from '@/utils/countries';
import { currenciesAsOptions } from '@/utils/currencies';

const paymentModes: {
  mode: PaymentMode;
  title: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    mode: 'native',
    title: __('Native Payment', 'growfund'),
    description: __(
      'Process payments directly through your platform with lower fees and simplified setup. ',
      'growfund',
    ),
    icon: NativePaymentIcon,
  },
  {
    mode: 'woo-commerce',
    title: __('WooCommerce', 'growfund'),
    description: __('Use WooCommerce to manage payments, invoices and more.', 'growfund'),
    icon: WooCommercePaymentIcon,
  },
];

const PaymentSelection = () => {
  const {
    setStep,
    paymentMode,
    setPaymentMode,
    setBaseCountry,
    onComplete,
    currency,
    setCurrency,
    loading,
  } = useOnboarding();

  const form = useForm<{ country: string; currency: string }>();

  const country = useWatch({ control: form.control, name: 'country' });
  const currencyValue = useWatch({ control: form.control, name: 'currency' });

  useEffect(() => {
    setBaseCountry(country);
  }, [country, setBaseCountry]);

  useEffect(() => {
    if (isDefined(currency)) {
      setCurrency(currency);
    }
  }, [currency, setCurrency]);

  useEffect(() => {
    if (!isDefined(country)) {
      return;
    }
    const countryObject = getCountryByCode(country);
    if (countryObject) {
      form.setValue('currency', `${countryObject.currency_symbol}:${countryObject.currency}`);
      setCurrency(`${countryObject.currency_symbol}:${countryObject.currency}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, form.setValue]);

  return (
    <>
      <DecisionBox className="gf-p-0">
        <Image
          src="/images/payment-mode.webp"
          className="gf-size-full gf-border-none gf-bg-transparent"
          fit="cover"
        />
      </DecisionBox>
      <DecisionBox>
        <Screen className="gf-space-y-5">
          <ScreenIndicator />
          <ScreenContent className="gf-flex gf-flex-col gf-justify-between gf-pb-6">
            <div>
              {growfundConfig.is_woocommerce_installed && (
                <>
                  <div className="gf-space-y-3">
                    <ScreenTitle>
                      {__('How would you like to accept payment?', 'growfund')}
                    </ScreenTitle>
                    <ScreenDescription>
                      {__(`Select a method through which you'll accept payments.`, 'growfund')}
                    </ScreenDescription>
                  </div>
                  <div className={'gf-grid gf-grid-cols-2 gf-gap-4 gf-mt-4'}>
                    {paymentModes.map((mode) => {
                      const isActive = mode.mode === paymentMode;
                      const Icon = mode.icon;
                      return (
                        <Box
                          key={mode.mode}
                          className={cn(
                            'gf-shadow-none gf-border gf-cursor-pointer hover:gf-border-border-hover',
                            isActive && 'gf-border-border-brand gf-bg-[#EBFFF8]',
                          )}
                          onClick={() => {
                            setPaymentMode(mode.mode);
                          }}
                        >
                          <BoxContent className="gf-p-4 gf-flex gf-flex-col gf-items-center gf-text-center gf-gap-2 gf-relative">
                            <Icon className="gf-shrink-0 gf-size-[3.875rem]" />
                            <div className="gf-space-y-3">
                              <p className="gf-typo-tiny gf-font-medium gf-text-fg-primary">
                                {mode.title}
                              </p>
                              <p className="gf-typo-tiny gf-font-[11px] gf-text-fg-secondary">
                                {mode.description}
                              </p>
                            </div>

                            {isActive && (
                              <div className="gf-absolute gf-top-[-10px] gf-left-[-10px] gf-size-5 gf-bg-background-fill-brand gf-rounded-full gf-flex gf-items-center gf-justify-center">
                                <Check className="gf-size-3 gf-text-white" />
                              </div>
                            )}
                          </BoxContent>
                        </Box>
                      );
                    })}
                  </div>
                </>
              )}

              <div className="gf-mt-6 gf-space-y-4">
                <Form {...form}>
                  <ComboBoxField
                    control={form.control}
                    name="country"
                    label={__('What country would you like to perform operations?', 'growfund')}
                    options={countriesAsOptions()}
                    placeholder={__('Select your country', 'growfund')}
                  />
                  <ComboBoxField
                    control={form.control}
                    name="currency"
                    label={__('Select currency', 'growfund')}
                    options={currenciesAsOptions()}
                    placeholder={__('Select your currency', 'growfund')}
                  />
                </Form>
              </div>
            </div>

            <ScreenFooter className="gf-static">
              <Button
                variant="ghost"
                onClick={() => {
                  setStep('mode-selection');
                }}
              >
                <ArrowLeft />
                {__('Back', 'growfund')}
              </Button>
              <Button
                onClick={onComplete}
                disabled={
                  !isDefined(paymentMode) || !isDefined(country) || !isDefined(currencyValue)
                }
                loading={loading}
              >
                <CheckCircle />
                {__('Complete', 'growfund')}
              </Button>
            </ScreenFooter>
          </ScreenContent>
        </Screen>
      </DecisionBox>
    </>
  );
};

export default PaymentSelection;
