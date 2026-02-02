import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './Component/ProtectedRoute';

// Pages
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import ResetPassword from './pages/ResetPassword.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import UpdatePassword from './pages/ResetPassword.jsx'
import BrandSetup from './Component/Brandsetup';
import CreateContent from './Component/CreateContent.jsx'
import ContentPage from './Component/ContentPage.jsx'
function App() {
  return (
  
      <HashRouter>
        <Routes>
          {/* Public routes */}
          <Route path = '/' element ={<CreateContent />}/>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path ="/resetpassword" element = {<ResetPassword/>}/>
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route
            path="/brand-setup"
            element={
                <BrandSetup />
            
            }  />
            <Route path = '/createContent' element = {<CreateContent />}/>
            <Route path = "/contentpage" element ={<ContentPage />}/>
            <Route path="/verify-email" element={<VerifyEmail />} />
    
        </Routes>
    </HashRouter>
  
  );
}

export default App;
