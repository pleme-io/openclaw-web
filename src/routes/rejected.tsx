import { Rejected } from '@/pages/Rejected';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/rejected')({
  component: Rejected,
});
