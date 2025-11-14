import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={'system'}
      className="gf-toaster gf-group"
      toastOptions={{
        classNames: {
          toast:
            'gf-group gf-toast group-[.toaster]:gf-bg-background group-[.toaster]:gf-text-foreground group-[.toaster]:gf-border-border group-[.toaster]:gf-shadow-lg',
          description: 'group-[.toast]:gf-text-muted-foreground',
          actionButton: 'group-[.toast]:gf-bg-primary group-[.toast]:gf-text-primary-foreground',
          cancelButton: 'group-[.toast]:gf-bg-muted group-[.toast]:gf-text-muted-foreground',
          success: '[&_svg]:gf-text-icon-success',
          error: '[&_svg]:gf-text-icon-critical',
          info: '[&_svg]:gf-text-icon-info',
          warning: '[&_svg]:gf-text-icon-warning',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
