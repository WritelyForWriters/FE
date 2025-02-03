import DefaultEditor from '@components/editor/DefaultEditor'

import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <DefaultEditor />
      </main>
      <footer className={styles.footer}></footer>
    </div>
  )
}
