import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import CalendarPage from './pages/CalendarPage';
import TodoList from "./pages/TodoList";
import NoPage from "./pages/NoPage";

export default function App() {

	return (
		<div>
			<Router>
				<Routes>
					<Route
						index
						element={<TodoList />}
					/>
					<Route
						path="/todo_react_app"
						element={<TodoList />}
					/>
					<Route
						path="/CalendarPage"
						element={<CalendarPage />}
					/>
					<Route path="*" element={<NoPage />} />
				</Routes>
			</Router>
		</div>
	);
}