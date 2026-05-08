import { createFileRoute } from '@tanstack/react-router';
import { Verify } from '@/pages/Verify';

export const Route = createFileRoute('/verify')({
  component: Verify,
});
