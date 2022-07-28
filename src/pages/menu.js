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
      <main className="min-h-screen">
        <section className="w-[300px] text-center mx-auto my-2 bg-white p-2">
          <button
            onClick={handleLogout}
            className="shadow-md hover:shadow-lg px-5 py-1 text-sm rounded bg-neutral-300 hover:bg-neutral-400 text-white font-medium"
          >
            Log out
          </button>
        </section>
      </main>
    </Layout>
  );
}
