import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
<<<<<<< HEAD
import Register from './pages/Register';
=======
import Register from './pages/Resgister';
>>>>>>> ed3a751d1602e4f18ae42998c040ef3798320499
import Home from './pages/Home';
import CreateEvent from './pages/CreateEvent';
import SignaturePage from './pages/SignaturePage';
import EventDetails from './pages/EventDetails';
<<<<<<< HEAD
import Profile from './pages/Profile';

=======
>>>>>>> ed3a751d1602e4f18ae42998c040ef3798320499

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/criar-evento" element={<CreateEvent />} />
<<<<<<< HEAD
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
=======
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
>>>>>>> ed3a751d1602e4f18ae42998c040ef3798320499
        <Route path="/signature" element={<SignaturePage />} />
        <Route path="/evento/:id" element={<EventDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
