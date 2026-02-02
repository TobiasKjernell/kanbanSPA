import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import AppLayout from "./components/AppLayout"
import ProtectedRoute from "./components/ProtectedRoute"
import DashboardPage from "./pages/DashboardPage"
import { QueryClientProvider } from "./providers/queryClient"
import LoginPage from "./pages/Login"

function App() {
  return (
    <>
      <QueryClientProvider>
        <BrowserRouter>
          <Routes>
            <Route element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>}>
              <Route index element={<Navigate replace to='dashboard' />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  )
}

export default App
