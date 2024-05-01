import Head from "next/head";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import heroImg from "../../public/assets/hero.png";

export default function Home() {
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
            <span>+12 posts</span>
          </section>
          <section className={styles["box"]}>
            <span>+90 comentarios</span>
          </section>
        </div>
      </main>
    </section>
  );
}
