import { useSession } from "next-auth/react";
import { Button } from "./Button";
import { ProfileImage } from "./ProfileImage";
import {
  FormEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { api } from "~/utils/api";

function updateTextAreaSize(textarea?: HTMLTextAreaElement) {
  if (textarea == null) return;
  textarea.style.height = "0";
  textarea.style.height = `${textarea.scrollHeight}px`;
}
function Form() {
  const session = useSession();
  const [inputValue, setInputValue] = useState("");
  const trpcUtils = api.useContext();
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const inputRef = useCallback((textarea: HTMLTextAreaElement) => {
    updateTextAreaSize(textarea);
    textAreaRef.current = textarea;
  }, []);
  const createTweet = api.tweet.create.useMutation({
    onSuccess: (newTweet) => {
      setInputValue("");

      if (session.status !== "authenticated") return;

      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, (oldData) => {
        if (oldData == null || oldData.pages[0] == null) return;

        const newCacheTweet = {
          ...newTweet,
          likeCount: 0,
          likedByMe: false,
          user: {
            id: session.data.user.id,
            name: session.data.user.name || null,
            image: session.data.user.image || null,
          },
        };

        return {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              tweets: [newCacheTweet, ...oldData.pages[0].tweets],
            },
            ...oldData.pages.slice(1),
          ],
        };
      });
    },
  });
  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [inputValue]);
  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    createTweet.mutate({ content: inputValue });
  }
  if (session.status !== "authenticated") return null;
  return (
    <form
      className="flex flex-col gap-3 border-b px-4 py-2"
      onSubmit={handleSubmit}
    >
      <div className="flex gap-4">
        <ProfileImage src={session.data?.user.image} />
        <textarea
          placeholder="What's happening?"
          ref={inputRef}
          style={{ height: 0 }}
          className="flex-grow resize-none overflow-hidden p-4 text-lg outline-none"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        ></textarea>
      </div>
      <Button className="self-end">Tweet</Button>
    </form>
  );
}
export function NewTweetForm() {
  const session = useSession();
  if (session.status !== "authenticated") return;

  return <Form />;
}
