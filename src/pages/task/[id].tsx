import Head from "next/head";
import styles from "./styles.module.css";
import { ChangeEvent, FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { GetServerSideProps } from "next";

import { db } from "@/config/firebase.conection";
import {
  doc,
  collection,
  query,
  where,
  getDoc,
  addDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import Textarea from "@/components/textarea";
import { FaTrash } from "react-icons/fa";

interface TaskProps {
  item: {
    tarefa: string;
    created: string;
    public: boolean;
    user: string;
    taskId: string;
  };
  allComments: CommentProps[];
}

interface CommentProps {
  id: string;
  comment: string;
  taskId: string;
  user: string;
  name: string;
}

export default function Task({ item, allComments }: TaskProps) {
  const { data: session } = useSession();

  const [input, setInput] = useState<string>("");
  const [comments, setComments] = useState<CommentProps[]>(allComments || []);
  async function handleComent(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    if (input === "") return;

    if (!session?.user?.email || !session?.user?.name) return;

    try {
      const docRef = await addDoc(collection(db, "comments"), {
        comment: input,
        created: new Date(),
        user: session?.user?.email,
        name: session?.user?.name,
        taskId: item?.taskId,
      });

      const data = {
        id: docRef.id,
        comment: input,
        user: session?.user?.email,
        name: session?.user?.name,
        taskId: item?.taskId,
      };

      setComments((oldItem) => [...oldItem, data]);

      setInput("");
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteComment(id: string): Promise<void> {
    try {
      const docRef = doc(db, "comments", id);
      await deleteDoc(docRef);

      const deletComment = comments.filter((item) => item.id != id);

      setComments(deletComment);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles["container"]}>
      <Head>
        <title>Tarefa - Detalhes da terafa</title>
      </Head>
      <main className={styles["main"]}>
        <h1>Tarefa</h1>
        <article className={styles["task"]}>
          <p>{item.tarefa}</p>
        </article>
      </main>

      <section className={styles["comentsContainer"]}>
        <h2>Deixar comentário</h2>
        <form onSubmit={handleComent}>
          <Textarea
            value={input}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setInput(e.target.value)
            }
            placeholder="Digite seu comentário"
          />
          <button
            disabled={!session?.user}
            type="submit"
            className={styles["button"]}
          >
            Enviar Comentáio
          </button>
        </form>
      </section>
      <section className={styles["comentsContainer"]}>
        <h2>Todos os Comentários</h2>
        {comments.length === 0 && <span>Nenhum comentario foi encontrado</span>}
        {comments.map((item) => (
          <article key={item.id} className={styles["comment"]}>
            <div className={styles["headComment"]}>
              <label className={styles["commentsLabel"]}>{item.name}</label>
              {item.user === session?.user?.email && (
                <button
                  onClick={() => handleDeleteComment(item.id)}
                  className={styles["buttonTrash"]}
                >
                  <FaTrash size={18} color="#ea3140" />
                </button>
              )}
            </div>
            <p>{item.comment}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

// SERVER SIDE

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;

  const docRef = doc(db, "tarefas", id);

  const q = query(collection(db, "comments"), where("taskId", "==", id));
  const snapshotComments = await getDocs(q);

  let allComments: CommentProps[] = [];
  snapshotComments.forEach((doc) => {
    allComments.push({
      id: doc.id,
      comment: doc.data().comment,
      user: doc.data().user,
      name: doc.data().name,
      taskId: doc.data().taskId,
    });
  });

  const snapshot = await getDoc(docRef);

  if (snapshot.data() === undefined || !snapshot.data()?.public) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const miliseconds = snapshot.data()?.created?.seconds * 1000;
  const task = {
    tarefa: snapshot.data()?.tarefa,
    public: snapshot.data()?.public,
    created: new Date(miliseconds).toLocaleDateString(),
    user: snapshot.data()?.user,
    taskId: id,
  };

  return {
    props: {
      item: task,
      allComments: allComments,
    },
  };
};
