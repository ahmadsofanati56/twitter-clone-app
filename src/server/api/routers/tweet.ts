import { useSession } from "next-auth/react";
import next from "next/types";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const tweetRouter = createTRPCRouter({
   infiniteFeed: publicProcedure.input(z.object({limit: z.number().optional(),cursor: z.object({id:z.string(), createdAt: z.date()}).optional()})).query(async ({input: {limit =10,cursor},ctx})=>{
    const userCurrentId= ctx.session?.user?.id;
   const data=await ctx.prisma.tweet.findMany({
      
       take: limit + 1 ,
       cursor : cursor ? {createdAt_id:cursor} : undefined,
       orderBy: [{createdAt:"desc"},{id : "desc"}],
      
       select : {
        id:true,
        createdAt: true,
        content: true,
        _count: { select:{likes: true}},
        likes: userCurrentId == null ? false : {where:  {userId : userCurrentId }},
        user: { select: {id:true, image:true,name:true}}
       } 
      }) ;
      let nextCursor: typeof cursor | undefined  ;
      if(data.length > limit){
        const nextItem = data.pop();
        if(nextItem != null){
          nextCursor={id:nextItem.id , createdAt: nextItem.createdAt}
        }
      }
      return {tweets: data.map((tweet)=>{
        return {
        id: tweet.id,
        content: tweet.content,
        likeCount: tweet._count.likes,
        user: tweet.user,
        likedByMe: tweet.likes?.length >0,
        createdAt: tweet.createdAt

        }
      }),nextCursor}
   }),
  create: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({input : {content},ctx})=> {
      const tweet= await ctx.prisma.tweet.create({data : {
        content,
        userId : ctx.session.user.id
      }})
      return tweet;
    }),

});
