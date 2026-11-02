
import LoginForm from "../components/auth/LoginForm";
import AuthLayout from "../layouts/AuthLayout";

const Login = () => {
  return (
    <AuthLayout
      title="Welcome back"
      description="Enter your email and password to sign in to your account."
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
