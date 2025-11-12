// components/layouts/MainLayout.tsx
import { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';

import Header from '../Header';
import Footer from '../Footer';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      {/* Header */}
      <Header />

      {/* Main content */}
      <Box flex="1" as="main">
        {children}
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default MainLayout;
