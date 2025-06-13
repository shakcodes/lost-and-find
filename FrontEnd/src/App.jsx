import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './component/Navbar';
import Footer from './component/Footer';
import Home from './component/Home';
import Login from './component/Login';
import SignUp from './component/SignUp';
import Lost from './component/Lost';
import Find from './component/Find';
import Profile from './component/Profile';
import ItemDetails from './component/ItemDetails';
import EditItem from './component/EditItem'; 

function App() {
  // const userId = localStorage.getItem('userId');
  // App.jsx
const userId = localStorage.getItem('userId') || null;


  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/find" element={<Find />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/lost" element={<Lost />} />
            <Route path="/profile" element={<Profile userId={userId} />} />
            <Route path="/details/:id" element={<ItemDetails />} />
            <Route path="/edit-item/:id" element={<EditItem />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
