import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>GyMemory</title>
        <meta name="description" content="GyMemory" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 style={{textAlign: 'center'}}>GyMemory - coming soon!</h1>
    </div>
  )
}
