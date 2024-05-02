import styles from "./style.module.css";
import Head from "next/head";

export default function Dashboard() {
  return (
    <section className={styles["container"]}>
      <Head>
        <title>Meu painel de tarefas</title>
      </Head>

      <h1>Paginal Painel</h1>
    </section>
  );
}
