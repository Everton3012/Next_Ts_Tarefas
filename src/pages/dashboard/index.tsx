import { useState, useEffect, ChangeEvent, FormEvent } from "react";

import { GetServerSideProps } from "next";
import styles from "./style.module.css";
import Head from "next/head";

import { getSession } from "next-auth/react";
import Textarea from "../../components/textarea";
import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";

export default function Dashboard() {
  const [input, setInput] = useState<string>("");
  const [publicTask, setPublicTask] = useState<boolean>(false);

  function handleChangePublic(e:ChangeEvent<HTMLInputElement>){
    setPublicTask(e.target.checked);
  }

  function handleRegisterTask(e:FormEvent){
    e.preventDefault();

    if(input === "") return;

    alert("TESTE");
  }

  return (
    <section className={styles["container"]}>
      <Head>
        <title>Meu painel de tarefas</title>
      </Head>
      <main className={styles["main"]}>
        <section className={styles["content"]}>
          <div className={styles["contentForm"]}>
            <h1 className={styles["title"]}>Qual a sua tarefa?</h1>
            <form onSubmit={handleRegisterTask}>
              <Textarea
                value={input}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setInput(e.target.value)
                }
                placeholder="Digite qual a sua tarefa..."
              />
              <div className={styles["checkBoxArea"]}>
                <input
                  type="checkbox"
                  className={styles["checkBox"]}
                  checked={publicTask}
                  onChange={handleChangePublic}
                />
                <label>Deixar tarefa publica?</label>
              </div>
              <button className={styles["button"]} type="submit">
                Registrar
              </button>
            </form>
          </div>
        </section>
        <section className={styles["taskContainer"]}>
          <h1>Minhas tarefas</h1>
          <article className={styles["task"]}>
            <div className={styles["tagContainer"]}>
              <label className={styles["tag"]}>PUBLICO</label>
              <button className={styles["shareButton"]}>
                <FiShare2 size={22} color="#3183ff" />
              </button>
            </div>
            <div className={styles["taskContent"]}>
              <p>Minha primeira tarefa</p>
              <button className={styles["trashButton"]}>
                <FaTrash size={24} color="ea3140" />
              </button>
            </div>
          </article>
          <article className={styles["task"]}>
            <div className={styles["tagContainer"]}>
              <label className={styles["tag"]}>PUBLICO</label>
              <button className={styles["shareButton"]}>
                <FiShare2 size={22} color="#3183ff" />
              </button>
            </div>
            <div className={styles["taskContent"]}>
              <p>Minha primeira tarefa</p>
              <button className={styles["trashButton"]}>
                <FaTrash size={24} color="ea3140" />
              </button>
            </div>
          </article>
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
