import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import Landingpage from './pages/Landingpage.jsx';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import UpdatePassword from './pages/UpdatePassword.jsx';
import AboutSection from './Footer/AboutSection.jsx';

// Components
import BrandSetup from './Component/Brandsetup';
import CreateContent from './Component/CreateContent.jsx';
import ContentPage from './Component/ContentPage.jsx';
import Subscription from './Component/Subscription.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landingpage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/about" element={<AboutSection />} />

        {/* App (auth checked inside each component) */}
        <Route path="/brand-setup" element={<BrandSetup />} />
        <Route path="/createContent" element={<CreateContent />} />
        <Route path="/contentpage" element={<ContentPage />} />
        <Route path="/subscription" element={<Subscription />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
