import Login from "@/components/Login";
import WithAuth from "@/components/WithAuth";

const LoginPage = () => {
    return (
      <WithAuth>
        <Login />
      </WithAuth>
     
    )
  };

  export default LoginPage;
  
  