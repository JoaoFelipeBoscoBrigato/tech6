import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Resgister";
import Home from "./pages/Home";
import CreateEvent from "./pages/CreateEvent";
import SignaturePage from "./pages/SignaturePage";
import EventDetails from "./pages/EventDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/criar-evento" element={<CreateEvent />} />
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signature" element={<SignaturePage />} />
        <Route path="/evento/:id" element={<EventDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
