import { PageHeader } from '../../components/ui';
import { PlannedPanel } from '../../components/admin/AdminBits';

export default function AdminPlanned({
  title,
  phase = 'Planned · Phase 2',
  description,
  bullets,
}: {
  title: string;
  phase?: string;
  description: string;
  bullets: string[];
}) {
  return (
    <div className="space-y-7">
      <PageHeader eyebrow="Admin" title={title} description="Not switched on yet." />
      <PlannedPanel title={title} phase={phase} description={description} bullets={bullets} />
    </div>
  );
}
