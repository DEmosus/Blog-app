import Image from "next/image";

import styles from "./hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.image}>
        <Image
          src="/images/site/isaac.jpg"
          alt="An image of myself"
          width={300}
          height={300}
          priority
        />
      </div>
      <h1>Hello, I&#39;m Isaac</h1>
      <p>
        Web development blogs - learn more about web description and new
        techonologies in computer science
      </p>
    </section>
  );
}
