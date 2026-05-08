import { createFileRoute } from '@tanstack/react-router';
import { Artifacts } from '@/pages/Artifacts';

export const Route = createFileRoute('/artifacts/')({
  component: Artifacts,
});
