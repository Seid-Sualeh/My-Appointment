import { useSelector } from "react-redux";
import Layout from "./src/components/common/Layout";
import AllRoutes from "./src/pages/AllRoutes";

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Layout>
      <AllRoutes />
    </Layout>
  );
}

export default App;
