import TweetFeed from "@/components/feed/TweetFeed";
import TweetForm from "@/components/feed/TweetForm";
import Header from "@/components/layout/Header";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-50 dark:bg-dark2">
      <Header label={"Home"} />
      <TweetForm />
      <TweetFeed />
    </main>
  );
}
