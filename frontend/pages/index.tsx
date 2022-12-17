import {Container} from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <Container maxWidth="md">
        <h1 style={{textAlign: 'center'}}>GyMemory - coming soon!!</h1>
        <Link href={'/login'}><h2 style={{textAlign: 'center'}}>Try DEMO. Only guest account login is working now.</h2></Link>
    </Container>
  )
}
