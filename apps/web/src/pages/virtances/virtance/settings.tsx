import { useParams } from 'react-router-dom';

import { VirtanceSettings } from '@/widgets/virtance-settings';

export default function VirtanceSettingsPage() {
  const params = useParams();
  const id = Number(params.id);

  return <VirtanceSettings id={id} />;
}
