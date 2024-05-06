import Head from "next/head";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import heroImg from "../../public/assets/hero.png";
import { GetStaticProps } from "next";

import { db } from "@/config/firebase.conection";

import {collection,getDocs} from "firebase/firestore";

interface HomeProps {
  posts: number;
  comments: number;
}

export default function Home({posts,comments}: HomeProps) {
  return (
    <section className={styles["container"]}>
      <Head>
        <title>Tarefas+ | Organize suas tarefas de forma fácil</title>
      </Head>

      <main className={styles["main"]}>
        <div className={styles["LogoContent"]}>
          <Image
            className={styles["hero"]}
            src={heroImg}
            alt={"Logo tarefas"}
            priority
          />
          <h1 className={styles["title"]}>
            Sistema feito para você organizar <br />
            seus estudos e tarefas
          </h1>
        </div>

        <div className={styles["infoContent"]}>
          <section className={styles["box"]}>
            <span>+{posts} posts</span>
          </section>
          <section className={styles["box"]}>
            <span>+{comments} comentarios</span>
          </section>
        </div>
      </main>
    </section>
  );
}


export const getStaticProps: GetStaticProps = async () => {

  const comnentRef = collection(db, "comments");
  const postsRef = collection(db, "tarefas");

  const comentSnapshot = await getDocs(comnentRef);
  const postsSnapshot = await getDocs(postsRef);

  return {
    props: {
      posts: postsSnapshot.size || 0,
      comments: comentSnapshot.size || 0,
    },
    revalidate: 60
  }
}