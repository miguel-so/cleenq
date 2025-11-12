import { ChakraProvider } from '@chakra-ui/react';

import { AuthProvider } from './lib/contexts/AuthContext';
import AppRoutes from './routes';

function App() {
  return (
    <AuthProvider>
      <ChakraProvider>
        <AppRoutes />
      </ChakraProvider>
    </AuthProvider>
  );
}

export default App;
