import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/Dashboard";
import Debts from "./pages/Debts";
import PaymentPlan from "./pages/PaymentPlan";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/debts" element={<Debts />} />
        <Route path="/payment-plan" element={<PaymentPlan />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
