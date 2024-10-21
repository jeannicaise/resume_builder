import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from "@chakra-ui/react";
import CVTemplate from './components/CVTemplate';
import ResumeForm from './creation/ResumeForm';
import ResumeFormEdit from './Modification/ResumeFormEdit';
import { AuthProvider } from './contexts/AuthContext';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <AuthProvider>
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/creation" element={<ResumeForm />} />

              {/* Routes nécessitant une authentification */}
          
              <Route 
                path="/modif/:user_id" 
                element={
                  <PrivateRoute>
                    <ResumeFormEdit />
                  </PrivateRoute>
                } 
              />
              
              {/* Route publique */}
              <Route path="/public/:user_id" element={<CVTemplate />} />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
}

export default App;
