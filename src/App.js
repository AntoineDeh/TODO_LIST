import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import CalendarPage from './pages/CalendarPage';
import TodoList from "./pages/TodoList";
import NoPage from "./pages/NoPage";
import {useState} from "react";

export default function App() {
	const [tasks, setTasks] = useState([]);

	return (
		<div>
			<Router>
				<Routes>
					<Route index element={<TodoList tasks={tasks} setTasks={setTasks} />} />
					<Route path="/todo_react_app" element={<TodoList tasks={tasks} setTasks={setTasks} />} />
					<Route path="/ToDoList" element={<TodoList tasks={tasks} setTasks={setTasks} />} />
					<Route path="/CalendarPage" element={<CalendarPage tasks={tasks} />} />
					<Route path="*" element={<NoPage />} />
				</Routes>
			</Router>
		</div>
	);
}