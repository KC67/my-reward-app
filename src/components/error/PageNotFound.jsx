import { useNavigate } from "react-router-dom";
import "./PageNotFound.css";

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <p className="notfound-message">Oops! Page not found</p>
      <button className="home-btn" onClick={() => navigate("/")}>
        Go Back Home
      </button>
    </div>
  );
};

export default PageNotFound;
