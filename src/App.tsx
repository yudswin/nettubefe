import React from 'react';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import routes, { RouteType } from "./routes"

const App: React.FC = () => {
  return (
    <>
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
    </>
  )
}

export default App
