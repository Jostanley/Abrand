import Footer from "./Footer.jsx"
import Hero from "./Hero.jsx"
import Features from "./Features.jsx"
import Pricing from "./Pricing.jsx"
import {useNavigate } from 'react-router-dom'
function Landingpage(){
  const navigate = useNavigate();
  return(
    <div className="h-screen flex flex-col bg-[#0f0f0f] text-white">
      <header className="fixed top-0 w-full z-50 bg-[#0f0f0f] border-b border-gray-800 px-4 py-3 flex justify-between items-center">
        <h1 className="font-semibold text-lg">Brand AI</h1>
        <button  className="text-sm text-gray-400 hover:text-white">
          Profile
        </button>
      </header>
              
          <div className="max-w-4xl text-center">
        
        {/* Badge */}
        <div className="inline-block px-4 py-1 mb-6 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-full">
          Intelligent Brand Management
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-bold text-gray-100 leading-tight">
          Your Brand, <span className="text-indigo-600">Remembered.</span> Always.
        </h1>

        {/* Subtext */}
        <p className="mt-6 text-lg md:text-xl text-gray-100">
          Set up your brand once. Every search, summary, and idea builds on it —
          intelligently, automatically. No repetition. Just smarter results.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button onClick ={()=>navigate('/signup')} className="
         mt-6 px-6 py-3 bg-indigo-600 rounded-xl hover:bg-indigo-700 transition font-medium ">
            Get Started
          </button>

          <button onClick ={()=>navigate('/login')} className=" mt-6 px-6 py-3 border border-gray-300 rounded-xl font-medium text-white hover:bg-gray-100 transition
          
          ">
            Login
          </button>
          
        </div>

    </div>
    <Hero />
      <Features />
      <Pricing />
      <Footer />
      </div>
    )
}
export default Landingpage