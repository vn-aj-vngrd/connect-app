/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/all",
        permanent: true,
      },
    ];
  },
  output: "standalone",
};

module.exports = nextConfig;
