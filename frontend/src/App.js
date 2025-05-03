import { Route, Routes } from "react-router-dom";
import Projects from "./pages/Projects";
import NewTask from "./components/NewTask";
import ViewTasks from "./components/ViewTasks";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

function App() {
  return (
   <>
    <Routes>
    <Route path="/projects" Component={Projects}/>
    <Route path="/add-task/:id" Component={NewTask}/>
    <Route path="/view-tasks/:id" Component={ViewTasks}/>
    <Route path="/login" Component={Login}/>
    <Route path="/" Component={Signup}/>
    </Routes>
   </>
  );
}

export default App;
