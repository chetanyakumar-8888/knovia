import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Study from './pages/Study'
import Quiz from './pages/Quiz'
import Lab from './pages/Lab'
import AiAssistant from './pages/AiAssistant'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Signup from './pages/Signup'
import OhmsLaw from './pages/labs/OhmsLaw'
import SimplePendulum from './pages/labs/SimplePendulum'
import ProjectileMotion from './pages/labs/ProjectileMotion'
import LensFocalLength from './pages/labs/LensFocalLength'
import AcidBaseTitration from './pages/labs/AcidBaseTitration'
import ResistorsSeries from './pages/labs/ResistorsSeries'
import Osmosis from './pages/labs/Osmosis'
import Photosynthesis from './pages/labs/Photosynthesis'
import CellDivision from './pages/labs/CellDivision'
import DnaStructure from './pages/labs/DnaStructure'
import WheatstoneBridge from './pages/labs/WheatstoneBridge'
import RefractionPrism from './pages/labs/RefractionPrism'
import PhTesting from './pages/labs/PhTesting'
import Electrochemistry from './pages/labs/Electrochemistry'
import Potentiometer from './pages/labs/Potentiometer'
import Chromatography from './pages/labs/Chromatography'
import SaltAnalysis from './pages/labs/SaltAnalysis'
import ChemicalReactions from './pages/labs/ChemicalReactions'

function App() {
  return (
    <div className="bg-gray-950 min-h-screen text-white">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/study" element={<Study />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/assistant" element={<AiAssistant />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />
<Route path="/lab/ohms-law" element={<OhmsLaw />} />
<Route path="/lab/simple-pendulum" element={<SimplePendulum />} />
<Route path="/lab/projectile-motion" element={<ProjectileMotion />} />
<Route path="/lab/lens-focal-length" element={<LensFocalLength />} />
<Route path="/lab/acid-base-titration" element={<AcidBaseTitration />} />
<Route path="/lab/resistors-series" element={<ResistorsSeries />} />
<Route path="/lab/osmosis" element={<Osmosis />} />
<Route path="/lab/photosynthesis" element={<Photosynthesis />} />
<Route path="/lab/cell-division" element={<CellDivision />} />
<Route path="/lab/dna-structure" element={<DnaStructure />} />
<Route path="/lab/wheatstone-bridge" element={<WheatstoneBridge />} />
<Route path="/lab/refraction-prism" element={<RefractionPrism />} />
<Route path="/lab/ph-testing" element={<PhTesting />} />
<Route path="/lab/electrochemistry" element={<Electrochemistry />} />
<Route path="/lab/potentiometer" element={<Potentiometer />} />
<Route path="/lab/chromatography" element={<Chromatography />} />
<Route path="/lab/salt-analysis" element={<SaltAnalysis />} />
<Route path="/lab/chemical-reactions" element={<ChemicalReactions />} />
      </Routes>
    </div>
  )
}

export default App