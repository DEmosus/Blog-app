import Head from "next/head";
import Hero from "@/components/home-page/hero";
import FeaturedPosts from "@/components/home-page/featured-post";
import { getFeaturedPosts } from "@/lib/posts-utils";

export default function Home(props) {
  return (
    <>
      <Head>
        <title>Blog App</title>
        <meta name="description" content="Programming blog post" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Hero />
        <FeaturedPosts posts={props.posts} />
      </div>
    </>
  );
}

export function getStaticProps() {
  const featuredPosts = getFeaturedPosts();

  return {
    props: {
      posts: featuredPosts
    }
  }
}
