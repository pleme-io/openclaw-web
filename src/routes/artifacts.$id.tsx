import { createFileRoute } from '@tanstack/react-router';
import { ArtifactDetail } from '@/pages/ArtifactDetail';

export const Route = createFileRoute('/artifacts/$id')({
  component: () => {
    const { id } = Route.useParams();
    return <ArtifactDetail id={id} />;
  },
});
