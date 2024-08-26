import { GetServerSideProps, NextPage } from "next";
import React from "react";
import { getSession } from "next-auth/react";
import { redirectUser } from "utils/auth";
import AddVideoSection from "components/content/AddVideoSection";

type Props = {};

const PanelAddVideos: NextPage<Props> = ({}) => {
  return (
    <>
      <AddVideoSection />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const { needRedirect, loginPath } = redirectUser(session);
  if (needRedirect) return loginPath;

  return {
    props: {
      session: await getSession(context),
    },
  };
};

export default PanelAddVideos;
