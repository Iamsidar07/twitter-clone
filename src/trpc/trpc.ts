import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { TRPCError, initTRPC } from "@trpc/server";
import { getServerSession } from "next-auth";

const t = initTRPC.create();
const middleware = t.middleware;
const isAuth = middleware(async (options) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return options.next({
    ctx: {
      email: session.user.email,
      userId: session.user.id as string,
      name: session.user.name,
      image: session.user.image,
    },
  });
});
export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
