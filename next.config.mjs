/** @type {import('next').NextConfig} */
const nextConfig =  {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_MONGODB_USERNAME: "Esaaka",
    NEXT_PUBLIC_MONGODB_PASSWORD: "K0ca3jlIzAj05JDL",
    NEXT_PUBLIC_MONGODB_CLUSTERNAME: "cluster0",
    NEXT_PUBLIC_MONGODB_DATABASE: "my-blog"
  }
};

export default nextConfig;

