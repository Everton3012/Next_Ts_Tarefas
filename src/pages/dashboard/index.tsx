import { useState, useEffect, ChangeEvent, FormEvent } from "react";

import { GetServerSideProps } from "next";
import styles from "./style.module.css";
import Head from "next/head";

import { getSession } from "next-auth/react";
import Textarea from "../../components/textarea";
import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";

import { db } from "../../config/firebase.conection";

import {
  addDoc,
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  snapshotEqual,
  doc,
  deleteDoc,
} from "firebase/firestore";
import Link from "next/link";

interface HomeProps {
  user: {
    email: string;
  };
}

interface TaskProps {
  id: string;
  created: Date;
  public: boolean;
  tarefa: string;
  user: string;
}

export default function Dashboard({ user }: HomeProps) {
  const [input, setInput] = useState<string>("");
  const [publicTask, setPublicTask] = useState<boolean>(false);
  const [tasks, setTasks] = useState<TaskProps[]>([]);

  useEffect(() => {
    async function loadTarefas() {
      const tarefasRef = collection(db, "tarefas");
      const q = query(
        tarefasRef,
        orderBy("created", "desc"),
        where("user", "==", user?.email)
      );

      onSnapshot(q, (snapshot) => {
        let lista = [] as TaskProps[];
        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            tarefa: doc.data().tarefa,
            created: doc.data().created,
            user: doc.data().user,
            public: doc.data().public,
          });
        });
        setTasks(lista);
      });
    }
    loadTarefas();
  }, [user?.email]);

  function handleChangePublic(e: ChangeEvent<HTMLInputElement>) {
    setPublicTask(e.target.checked);
  }

  async function handleRegisterTask(e: FormEvent) {
    e.preventDefault();

    if (input === "") return;

    try {
      await addDoc(collection(db, "tarefas"), {
        tarefa: input,
        created: new Date(),
        user: user?.email,
        public: publicTask,
      });

      setInput("");
      setPublicTask(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleShare(id: string) {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/task/${id}`
    )

    alert("url copiada com sucesso")
  }
  async function handleDeleteTask(id: string) {
    const docRef = doc(db, "tarefas", id)
    await deleteDoc(docRef);
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
          {tasks &&
            tasks.map((item) => (
              <article key={item.id} className={styles["task"]}>
                {item.public && (
                  <div className={styles["tagContainer"]}>
                    <label className={styles["tag"]}>PUBLICO</label>
                    <button
                      className={styles["shareButton"]}
                      onClick={() => handleShare(item.id)}
                    >
                      <FiShare2 size={22} color="#3183ff" />
                    </button>
                  </div>
                )}
                <div className={styles["taskContent"]}>
                  {item.public ? (
                    <Link href={`/task/${item.id}`}>
                      <p>{item.tarefa}</p>
                    </Link>
                  ) : (
                    <p>{item.tarefa}</p>
                  )}
                  <button onClick={() => handleDeleteTask(item.id)} className={styles["trashButton"]}>
                    <FaTrash size={24} color="ea3140" />
                  </button>
                </div>
              </article>
            ))}
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
    props: {
      user: {
        email: session?.user.email,
      },
    },
  };
};
