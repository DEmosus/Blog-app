import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

import PostHeader from "./post-header";
import styles from "./post-header.module.css";

export default function PostContent(props) {
  const { post } = props;
  const imagePath = `/images/posts/${post.slug}/${post.image}`;

  const customRenderers = {
    p(paragraph) {
      const { node } = paragraph;

      if (node.children[0] && node.children[0].tagName === "img") {
        const image = node.children[0];

        return (
          <div className={styles.image} >
            <Image src={`/images/posts/${post.slug}/${image.properties.src}`} alt={image.properties.alt} width={600} height={300} />
          </div>
        )
      }
      return <p>{paragraph.children}</p>;
    },
    code(code) {
      const { className, children } = code;
      const language = className ? className.split('-')[1] : null;
      return(
        <SyntaxHighlighter style={atomDark} language={language}>{children}</SyntaxHighlighter>
      )
    }

  }

  return (
    <article className={styles.content}>
      <PostHeader title={post.title} image={imagePath} />
      <ReactMarkdown components={customRenderers}>{post.content}</ReactMarkdown>
    </article>
  );
}



