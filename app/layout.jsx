import { UserProvider } from "@/context/user";
import "../styles/globals.css";
import "../styles/utility.css";
import "../styles/animations.css";
import Header from "@/components/header/header";

export const metadata = {
  title: "Aaron Currie | Portfolio",
  description: "A interactive experience showcasing my work and skills as a developer.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <Header />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
