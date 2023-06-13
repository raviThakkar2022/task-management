import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegistrationForm from "./components/RegistrationForm";
import LoginForm from "./components/Login";
import KanbanBoard from "./components/KanbanBoard";
import Dashboard from "./components/Dashboard";
import TaskManagement from "./components/TaskManagement";


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" exact element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/task" element={<TaskManagement />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path='*' element={<LoginForm/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
