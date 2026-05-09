import { Artifacts } from '@/pages/Artifacts';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/artifacts/')({
  component: Artifacts,
});
