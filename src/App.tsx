import React from 'react';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import routes, { RouteType } from "./routes"
import { LanguageProvider } from '@contexts/LanguageContext';
import { AuthProvider } from '@contexts/AuthContext';

const App: React.FC = () => {
  return (
    <>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {routes.map((route: RouteType) => {
                const Page = route.page;
                return (
                  <Route key={route.path} path={route.path} element={<Page />} />
                )
              })}
            </Routes>
          </Router>
        </AuthProvider>
      </LanguageProvider>

    </>
  )
}

export default App
