import { Container } from '@mui/material';
import Link from 'next/link';

export default function Home() {
  // Currently, we redirect directly to /login instead of rendering this page. Check next.config.js file.
  return (
    <Container maxWidth="md">
      <h1 style={{ textAlign: 'center' }}>GyMemory - coming soon!!</h1>
      <Link href={'/login'}>
        <h2 style={{ textAlign: 'center' }}>Try DEMO. Almost everything works.</h2>
      </Link>
    </Container>
  );
}
