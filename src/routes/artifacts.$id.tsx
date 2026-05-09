import { ArtifactDetail } from '@/pages/ArtifactDetail';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/artifacts/$id')({
  component: () => {
    const { id } = Route.useParams();
    return <ArtifactDetail id={id} />;
  },
});
