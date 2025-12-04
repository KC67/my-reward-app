import "./index.css";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <div className="app-container" data-testid="app-container">
      <AppRoutes />
    </div>
  );
}

export default App;
