import { Overview } from '@/pages/Overview';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Overview,
});
