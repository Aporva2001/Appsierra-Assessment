import { Route, Routes } from "react-router-dom";
import Projects from "./pages/Projects";

function App() {
  return (
   <>
    <Routes>
    <Route path="/projects" Component={Projects}/>
    </Routes>
   </>
  );
}

export default App;
