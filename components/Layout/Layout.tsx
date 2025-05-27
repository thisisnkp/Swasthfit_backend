import StoreProvider from "@/app/StoreProvider";
import Header from "../Header/Header";
import Navbar from "../Navbar";
import WithAuth from "../WithAuth";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <StoreProvider>
      <WithAuth>
        <Header />
        <Navbar />
        <main>{children}</main>
      </WithAuth>
    </StoreProvider>
  );
};

export default Layout;
