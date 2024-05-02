import { GetServerSideProps } from "next";
import styles from "./style.module.css";
import Head from "next/head";
import { getSession } from "next-auth/react";

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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  //console.log(session);

  if(!session?.user){
    return{
      redirect:{
        destination:"/",
        permanent: false,
      }
    }
  }
  return {
    props: {},
  };
};
