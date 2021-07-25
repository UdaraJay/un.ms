import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>un.ms</title>
        <meta name="description" content="un.ms" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Image className={styles.logo} src="/unms.svg" alt="unms Logo" height={240} width={240} />
      <br></br>
<a href="https://github.com/UdaraJay/un.ms/discussions/1">*let me know what I should <br></br>do with this website.</a>
    </div>
  )
}
