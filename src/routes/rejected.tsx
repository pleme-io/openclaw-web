import { createFileRoute } from '@tanstack/react-router';
import { Rejected } from '@/pages/Rejected';

export const Route = createFileRoute('/rejected')({
  component: Rejected,
});
