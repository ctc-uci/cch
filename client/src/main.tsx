import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import App from "./App.tsx";
import { BrowserRouter as Router } from "react-router-dom";

const colors = {
  brand: {},
};

const theme = extendTheme({ colors });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <Router>
        <App />
      </Router>
    </ChakraProvider>
  </StrictMode>
);
