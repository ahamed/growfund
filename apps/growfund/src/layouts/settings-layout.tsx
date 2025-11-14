import SettingsLayoutContent from '@/features/settings/components/settings-layout-contents';
import { SettingsProvider } from '@/features/settings/context/settings-context';

const SettingsLayout = () => {
  return (
    <SettingsProvider>
      <SettingsLayoutContent />
    </SettingsProvider>
  );
};

export default SettingsLayout;
