import MyRoutes from "./routes";
import './index.css';
import { ConfigProvider } from "antd";

function App() {
  return (
    <ConfigProvider
      theme={{
          token: {
          fontFamily: 'Poppins', 
          fontSize: 13
        }
      }}
    >
        <MyRoutes />
        </ConfigProvider>  
   
  );
}

export default App;
