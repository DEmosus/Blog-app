---
title: Next-auth js
excerpt: Next-auth js is an open-source authentication solution tailored for Next.js applications
image: next-auth.jpg
isFeatured: true
date: "2024-10-30"
---

# Comprehensive Guide to Using NextAuth.js in Next.js Applications

NextAuth.js is an open-source authentication solution tailored for Next.js applications. It provides a flexible and secure approach to handle authentication, supporting various sign-in methods and services. This guide will walk you through the essential steps to integrate NextAuth.js into your Next.js project, including user signup, session management, route protection, and more.

## Key Features of NextAuth.js

- **Multiple Providers:** Supports OAuth providers like Google, Facebook, GitHub, and custom providers with credentials-based authentication.
- **Passwordless Authentication:** Allows email-based passwordless sign-in using magic links.
- **Database Integration:** Can be used with or without a database. Supports popular databases like MySQL, PostgreSQL, MongoDB, and SQLite.
- **Session Management:** Supports JSON Web Tokens (JWT) and database sessions, with hooks and methods for managing sessions on both client and server sides.
- **Security:** Implements best practices including CSRF protection and secure cookie handling, and uses encrypted JWTs by default.
- **Serverless Compatibility:** Designed to work seamlessly with serverless environments like AWS Lambda, Vercel, and others.

## Setting Up NextAuth.js

### 1. Install NextAuth.js

First, install the NextAuth.js package:

```bash
npm install next-auth

```

### 2. Adding a User Signup API Route

Create a file named signup.js in the pages/api/auth directory:

```js
// pages/api/auth/signup.js
import { hash } from "bcryptjs";
import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password" });
  }

  const hashedPassword = await hash(password, 12);

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db();

  const existingUser = await db.collection("users").findOne({ email });

  if (existingUser) {
    client.close();
    return res.status(422).json({ message: "User already exists" });
  }

  await db.collection("users").insertOne({
    email,
    password: hashedPassword,
  });

  client.close();
  res.status(201).json({ message: "User created" });
}
```

### 3. Sending Signup Requests from the Frontend

Create a signup form component:

```js
// components/SignupForm.js
import { useState } from "react";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}
```

### 4. Adding the Credentials Auth Provider

Create a file named [...nextauth].js in the pages/api/auth directory:

```js
// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verify } from "bcryptjs";
import { MongoClient } from "mongodb";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db();

        const user = await db
          .collection("users")
          .findOne({ email: credentials.email });

        if (!user) {
          client.close();
          throw new Error("No user found");
        }

        const isValid = await verify(credentials.password, user.password);

        if (!isValid) {
          client.close();
          throw new Error("Invalid password");
        }

        client.close();
        return { email: user.email };
      },
    }),
  ],
  session: {
    jwt: true,
  },
  callbacks: {
    async jwt(token, user) {
      if (user) {
        token.email = user.email;
      }
      return token;
    },
    async session(session, token) {
      session.user.email = token.email;
      return session;
    },
  },
});
```

### 5. Managing Active Sessions on the Frontend

Wrap your application with SessionProvider in your \_app.js or \_app.tsx file:

```js
// pages/_app.js
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
```

### 6. Adding User Logout (Signout)

Create a logout button component:

```js
// components/LogoutButton.js
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return <button onClick={() => signOut()}>Sign Out</button>;
}
```

### 7. Adding Client-Side Page Guards (Route Protection)

Use the useSession hook to protect client-side routes:

```js
// components/ProtectedPage.js
import { useSession } from "next-auth/react";

export default function ProtectedPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // Redirect to sign-in page
      window.location.href = "/api/auth/signin";
    },
  });

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return <p>Welcome, {session.user.email}</p>;
}
```

### 8. Adding Server-Side Page Guards

Use the getSession method for server-side protection:

```js
// pages/protected.js
import { getSession } from "next-auth/react";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default function ProtectedPage({ session }) {
  return <div>Welcome, {session.user.email}</div>;
}
```

### 9. Protecting the Auth Page

Redirect authenticated users away from the auth page:

```js
// pages/auth.js
import { getSession } from "next-auth/react";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default function AuthPage() {
  return <div>Sign In or Sign Up</div>;
}
```

### 10. Adding Change Password Logic

Create a change password API route:

```js
// pages/api/auth/change-password.js
import { hash, compare } from "bcryptjs";
import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  const { email, oldPassword, newPassword } = req.body;

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db();

  const user = await db.collection("users").findOne({ email });

  if (!user) {
    client.close();
    return res.status(404).json({ message: "User not found" });
  }

  const isValid = await compare(oldPassword, user.password);

  if (!isValid) {
    client.close();
    return res.status(403).json({ message: "Invalid old password" });
  }

  const hashedPassword = await hash(newPassword, 12);

  await db
    .collection("users")
    .updateOne({ email }, { $set: { password: hashedPassword } });

  client.close();
  res.status(200).json({ message: "Password updated" });
}
```

### 11. Sending Change Password Request from the Frontend

Create a change password form component:

```js
// components/ChangePasswordForm.js
import { useState } from 'react';

export default function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
```
