module.exports = {
  siteMetadata: {
    title: "Snuggly",
    description:
      "Listen to your baby's real heartbeat at home with just your iPhone and headphones — no extra device. Record it, keep it, share it. From around week 22.",
    siteUrl: "https://www.snugglyapp.com",
  },
  plugins: [
    {
      resolve: `gatsby-plugin-gdpr-cookies`,
      options: {
        googleAnalytics: {
          trackingId: "G-YX5J7CHPNF",
          cookieName: "gatsby-gdpr-google-analytics",
          anonymize: true,
          allowAdFeatures: false,
        },
        facebookPixel: {
          pixelId: "790869583968518",
          cookieName: "gatsby-gdpr-facebook-pixel",
        },
        // Only enable tracking in production
        environments: ["production"],
      },
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sharp",
    "gatsby-plugin-image",
    "gatsby-transformer-json",
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /assets/ // See below to configure properly
        }
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `files`,
        path: `${__dirname}/src/files`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {},
    },
  ],
};
