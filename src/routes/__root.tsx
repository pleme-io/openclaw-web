import { Outlet, createRootRoute, Link } from '@tanstack/react-router';
import { AppBar, Box, Container, Toolbar, Typography, Button } from '@mui/material';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="default" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 2 }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
              openclaw &mdash; proof chain
            </Typography>
            <Button component={Link} to="/" color="inherit">
              Overview
            </Button>
            <Button component={Link} to="/artifacts" color="inherit">
              Artifacts
            </Button>
            <Button component={Link} to="/verify" color="inherit">
              Verify
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
