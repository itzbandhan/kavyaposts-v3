import "@styles/globals.css";
import Image from "next/image";
import logo from "../public/assets/images/logo.svg";

import Nav from "@components/Nav";
import Provider from "@components/Provider";

export const metadata = {
  title: "KavyaPosts | Share, Discover, Explore",
  description:
    "A vibrant online community for Kavya School +2 students to share thoughts, discover ideas, and explore new posts.",
  keywords: [
    "Kavya School",
    "Kavya +2",
    "student community",
    "online forum",
    "share ideas",
    "discover posts",
    "educational resources",
  ],
  openGraph: {
    title: "KavyaPosts | Your Digital Hub",
    description:
      "Share thoughts, discover ideas, explore the new posts, Connect with fellow students, share knowledge, and stay updated with the latest trends.",
    images: [
      {
        url: "/assets/images/logo.svg", // Assuming the logo is accessible at this path
        alt: "KavyaPosts Logo",
        width: 1200,
        height: 630,
      },
    ],
    siteName: "KavyaPosts",
  },
};

const RootLayout = ({ children }) => (
  <html lang='en'>
    <body>
      <Provider>
        <div className='main'>
          <div className='gradient' />
        </div>

        <main className='app'>
          <Nav />
          {children}
        </main>
      </Provider>
    </body>
  </html>
);

export default RootLayout;
