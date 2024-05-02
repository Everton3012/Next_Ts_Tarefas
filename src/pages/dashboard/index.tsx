import { GetServerSideProps } from "next";
import styles from "./style.module.css";
import Head from "next/head";
import { getSession } from "next-auth/react";

import Textarea from "../../components/textarea";

export default function Dashboard() {
  return (
    <section className={styles["container"]}>
      <Head>
        <title>Meu painel de tarefas</title>
      </Head>
      <main className={styles["main"]}>
        <section className={styles["content"]}>
          <div className={styles["contentForm"]}>
            <h1 className={styles["title"]}>Qual a sua tarefa?</h1>
            <form>
              <Textarea />
              <div className={styles["checkBoxArea"]}>
                <input type="checkbox" className={styles["checkBox"]} />
                <label>Deixar tarefa publica?</label>
              </div>
              <button className={styles["button"]} type="submit">
                Registrar
              </button>
            </form>
          </div>
        </section>
      </main>
    </section>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  //console.log(session);

  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
