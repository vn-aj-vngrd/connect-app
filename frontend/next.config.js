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
};

module.exports = nextConfig;
