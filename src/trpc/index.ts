import { db } from "@/db";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import z from "zod";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { INFINITE_QUERY_LIMIT } from "@/config/inifiteQuery";
export const appRouter = router({
  currentUser: publicProcedure.query(async () => {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) throw new TRPCError({ code: "UNAUTHORIZED" });
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) throw new TRPCError({ code: "NOT_FOUND" });
    return user;
  }),

  register: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        password: z.string(),
        username: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { name, email, username, password } = input;
      if (!email || !password || !username || !name) {
        throw new TRPCError({
          message: "Missing Credentials",
          code: "BAD_REQUEST",
        });
      }
      const saltPassword = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, saltPassword);
      const user = await db.user.create({
        data: {
          name,
          email,
          hashedPassword,
          username,
        },
      });
      if (!user) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      return user;
    }),
  getAllUser: publicProcedure.query(async () => {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 12,
    });
    return users;
  }),
  getUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const { userId } = input;
      if (!userId || typeof userId !== "string") {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      const user = await db.user.findUnique({
        where: {
          id: userId,
        },
      });
      // How many accounts he follows
      const followingCount = await db.user.count({
        where: {
          followingIds: {
            has: userId,
          },
        },
      });
      return { user, followingCount };
    }),
  editProfile: privateProcedure
    .input(
      z.object({
        name: z.string(),
        username: z.string(),
        bio: z.string().nullish(),
        profileImage: z.string().nullish(),
        coverImage: z.string().nullish(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { email } = ctx;
      const { name, username, bio, profileImage, coverImage } = input;
      if (!name || !username) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      const updatedUser = await db.user.update({
        where: {
          email,
        },
        data: {
          name,
          username,
          bio,
          profileImage,
          coverImage,
        },
      });
      return updatedUser;
    }),
  getPosts: publicProcedure
    .input(
      z.object({
        userId: z.string().nullish(),
        cursor: z.string(),
        limit: z.number().min(1).max(100).nullish(),
      }),
    )
    .query(async ({ input }) => {
      const { userId, cursor } = input;
      const limit = input.limit ?? INFINITE_QUERY_LIMIT;
      let posts;
      if (userId) {
        posts = await db.post.findMany({
          where: {
            userId,
          },
          take: limit + 1,
          cursor: cursor ? { id: cursor } : undefined,
          include: {
            user: true,
            comments: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      } else {
        posts = await db.post.findMany({
          include: {
            user: true,
            comments: true,
          },
          take: limit + 1,
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: {
            createdAt: "desc",
          },
        });
      }
      let nextCursor: string | undefined = undefined;
      if (posts?.length > limit) {
        const lastPost = posts[posts.length - 1];
        nextCursor = lastPost.id;
      }

      return { posts, nextCursor };
    }),
  getPost: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ input }) => {
      const { postId } = input;
      if (!postId) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      const post = await db.post.findUnique({
        where: {
          id: postId,
        },
        include: {
          user: true,
          comments: {
            include: {
              user: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });
      return post;
    }),
  createPost: privateProcedure
    .input(z.object({ body: z.string(), imageContent: z.string().nullish() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { body, imageContent } = input;
      if (!body) {
        return new TRPCError({ code: "BAD_REQUEST" });
      }
      const createdPost = await db.post.create({
        data: {
          body,
          imageContent,
          userId,
        },
      });
      return createdPost;
    }),
  toggleFollow: privateProcedure
    .input(z.object({ userIdToToggleFollow: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userIdToToggleFollow } = input;
      const { userId } = ctx;

      const userToToggleFollow = await db.user.findUnique({
        where: {
          id: userIdToToggleFollow,
        },
      });
      if (!userToToggleFollow) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const followingIds = userToToggleFollow.followingIds || [];
      const isUserAllreadyFollowing = followingIds.includes(userId);
      let updatedFollowingIds: string[];
      if (isUserAllreadyFollowing) {
        //Unfollow
        updatedFollowingIds = followingIds.filter(
          (followingId) => followingId !== userId,
        );
      } else {
        //follow
        updatedFollowingIds = [...followingIds, userId];
        try {
          await db.notification.create({
            data: {
              userId: userIdToToggleFollow,
              senderUserId: userId,
              type: "FOLLOW",
            },
          });
          await db.user.update({
            where: {
              id: userIdToToggleFollow,
            },
            data: {
              hashNotifications: true,
            },
          });
        } catch (error) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }
      }
      //update followingIds
      const updatedUser = await db.user.update({
        where: {
          id: userIdToToggleFollow,
        },
        data: {
          followingIds: updatedFollowingIds,
        },
      });
      return updatedUser;
    }),
  toggleLikePost: privateProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { postId } = input;
      if (!postId) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      const post = await db.post.findUnique({
        where: {
          id: postId,
        },
      });
      if (!post) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      const likedIds = [...(post.likedIds || [])];
      const isAllreadyLiked = likedIds.includes(userId);
      let updatedLikeIds;
      if (isAllreadyLiked) {
        // unlike
        updatedLikeIds = likedIds.filter((likedId) => likedId !== userId);
      } else {
        // like
        updatedLikeIds = [...likedIds, userId];
        try {
          //send him a notification
          await db.notification.create({
            data: {
              userId: post.userId,
              type: "LIKE",
              senderUserId: userId,
            },
          });
          await db.user.update({
            where: {
              id: post.userId,
            },
            data: {
              hashNotifications: true,
            },
          });
        } catch (error) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }
      }
      const updatedPost = await db.post.update({
        where: {
          id: postId,
        },
        data: {
          likedIds: updatedLikeIds,
        },
      });

      return updatedPost;
    }),
  comment: privateProcedure
    .input(z.object({ postId: z.string(), body: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { postId, body } = input;
      if (!postId) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const comment = await db.comment.create({
        data: {
          body,
          userId,
          postId,
        },
      });

      try {
        const post = await db.post.findUnique({
          where: {
            id: postId,
          },
        });
        if (post?.userId) {
          await db.notification.create({
            data: {
              userId: post.userId,
              type: "COMMENT",
              senderUserId: userId,
            },
          });
          await db.user.update({
            where: {
              id: post.userId,
            },
            data: {
              hashNotifications: true,
            },
          });
        }
      } catch (error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      return comment;
    }),
  getNotifications: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });
    const notifications = await db.notification.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    // reset hasNotifications
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        hashNotifications: false,
      },
    });
    return notifications;
  }),
  createBookmark: privateProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { postId } = input;
      if (!postId) throw new TRPCError({ code: "BAD_REQUEST" });
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });
      const post = await db.post.findUnique({
        where: {
          id: postId,
        },
      });
      const bookmarkIds = [...(post?.bookmarkIds || [])];
      const hasBookmarked = bookmarkIds.includes(userId);
      let updatedBookmarkIds;
      let bookmark;
      if (hasBookmarked) {
        updatedBookmarkIds = bookmarkIds.filter(
          (bookmarkId) => bookmarkId !== userId,
        );
        // remove bookmark

        const currentBookmark = await db.bookmark.findFirst({
          where: {
            userId,
            postId,
          },
        });
        await db.bookmark.delete({
          where: {
            id: currentBookmark?.id,
          },
        });
      } else {
        updatedBookmarkIds = [...bookmarkIds, userId];
        bookmark = await db.bookmark.create({
          data: {
            userId,
            postId,
          },
        });
      }
      await db.post.update({
        where: {
          id: postId,
        },
        data: {
          bookmarkIds: updatedBookmarkIds,
        },
      });

      return bookmark;
    }),
  getBookmark: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });
    const bookmark = await db.bookmark.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
        post: {
          include: {
            comments: true,
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return bookmark;
  }),
});
export type AppRouter = typeof appRouter;
