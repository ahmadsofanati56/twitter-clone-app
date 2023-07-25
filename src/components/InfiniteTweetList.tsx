import InfiniteScroll from "react-infinite-scroll-component";
import { ProfileImage } from "./ProfileImage";
import Link from "next/link";

 type Tweet ={
    id: string;
    content:string;
    createdAt: Date;
    likeCount: number;
    likedByMe: boolean;
    user: {id: string,image: string | null, name: string | null}
 }
  type InfiniteTweetListProps= {
    isLoading: boolean,
    isError: boolean,
    hasMore:boolean,
    fetchNewTweets: ()=> Promise<unknown>,
    tweets?: Tweet[]
  }
 export function InfiniteTweetList({tweets,isError,isLoading,hasMore ,fetchNewTweets} : InfiniteTweetListProps){
    if(isError) return <h1>Error...</h1>
    if(isLoading) return <h1>Loading...</h1>
    if(tweets == null || tweets.length ==0) {
        return (<h2 className="my-4 text-2xl text-center text-gray-500">No Tweets</h2>);
    }
    
    return <ul>
        <InfiniteScroll dataLength={tweets.length} hasMore={hasMore} loader={"Loading..." } next={fetchNewTweets} >
            {tweets.map((tweet)=> {
                return <TweetCard key={tweet.id}  {...tweet}/>
            })}

        </InfiniteScroll>
    </ul> 
 }

 function TweetCard({id,user,content,createdAt,likeCount,likedByMe} : Tweet){
    return <li className="flex gap-4 border-b px-4 py-4"><Link href={`/profiles/${user.id}`}><ProfileImage src={user.image}/></Link></li>

 }