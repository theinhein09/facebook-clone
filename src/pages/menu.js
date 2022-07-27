import { useNavigate } from "react-router-dom";
import { Layout } from "../components/layout";
import { auth } from "../firebase/authentication";

export function Menu() {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await auth._signOut();
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <Layout>
      <button
        onClick={handleLogout}
        className="shadow-md hover:shadow-lg px-4 py-1 text-sm rounded-full bg-red-300 hover:bg-red-400 text-white"
      >
        Log out
      </button>
    </Layout>
  );
}
