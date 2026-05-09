import { Tour, startTour } from '@/widgets/Tour';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import { Link, Outlet, createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Tour />
      <AppBar position="static" color="default" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 2 }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
              openclaw &mdash; proof chain
            </Typography>
            <Button component={Link} to="/" color="inherit" data-tour="nav-overview">
              Overview
            </Button>
            <Button component={Link} to="/artifacts" color="inherit" data-tour="nav-artifacts">
              Artifacts
            </Button>
            <Button component={Link} to="/rejected" color="inherit" data-tour="nav-rejected">
              Rejected
            </Button>
            <Button component={Link} to="/verify" color="inherit" data-tour="nav-verify">
              Verify
            </Button>
            <Button component={Link} to="/explain" color="inherit" data-tour="nav-explain">
              Explain
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<PlayCircleFilledIcon />}
              onClick={startTour}
              data-tour="take-tour"
            >
              Take tour
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
