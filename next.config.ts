import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/learn/how-to-ship-a-car",
        destination: "/how-to-ship-a-car",
        permanent: true,
      },
      {
        source: "/learn/car-shipping-costs",
        destination: "/car-shipping-costs",
        permanent: true,
      },
      {
        source: "/learn/cross-country-car-shipping",
        destination: "/cross-country-car-shipping",
        permanent: true,
      },
      {
        source: "/learn/trueprice-guarantee",
        destination: "/trueprice-guarantee",
        permanent: true,
      },
      {
        source: "/dealer-auto-car-shipping",
        destination: "/dealer-auto-transport",
        permanent: true,
      },
      {
        source: "/military-car-shipping",
        destination: "/military-pcs-car-shipping",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
