import { Explain } from '@/pages/Explain';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/explain')({
  component: Explain,
});
