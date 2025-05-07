import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Projects from "./pages/Projects";
import NewTask from "./components/NewTask";
import ViewTasks from "./components/ViewTasks";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import EditTask from "./components/EditTask";
import { Button, Box } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const showLogout = location.pathname !== "/login" && location.pathname !== "/";
  const showProjectsButton = location.pathname !== "/projects" && location.pathname !== "/login" && location.pathname !== "/";
  
  const handleLogout = () => {
    localStorage.clear()
    navigate("/login");
  };

  const goToProjects = () => {
    navigate("/projects");
  };

  return (
    <>
     {showProjectsButton && (
        <Box
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
          }}
        >
          <Button variant="contained" color="primary" onClick={goToProjects} startIcon={<ArrowBackIcon />}>
            Projects
          </Button>
        </Box>
      )}

      {showLogout && (
        <Box
    sx={{
      position: "absolute",
      top: 16,
      right: 16,
    }}
  >
          <Button variant="contained" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      )}

      <Routes>
        <Route path="/projects" Component={Projects} />
        <Route path="/add-task/:id" Component={NewTask} />
        <Route path="/view-tasks/:id" Component={ViewTasks} />
        <Route path="/edit-task/:id" Component={EditTask} />
        <Route path="/login" Component={Login} />
        <Route path="/" Component={Signup} />
      </Routes>
    </>
  );
}

export default App;
