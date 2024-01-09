/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/all",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
