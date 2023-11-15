import { db } from "@/db";
import { NextApiRequest } from "next";
import { getSession } from "next-auth/react";

const getCurrentUser = async (request: NextApiRequest) => {
  const session = await getSession({ req: request });
  if (!session?.user?.email) {
    throw new Error("Not Signed In");
  }
  const currentUser = await db.user.findUnique({
    where: {
      email: session.user.email,
    },
  });
  if (!currentUser) {
    throw new Error("Not Signed In");
  }

  return { currentUser };
};

export default getCurrentUser;
