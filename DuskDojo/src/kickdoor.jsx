import { useNavigate } from "react-router-dom";

function Enter() {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate("/main-dojo"); // navigate to main page
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to My Site</h1>
      <button
        onClick={handleEnter}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        Enter
      </button>
    </div>
  );
}

export default Enter;