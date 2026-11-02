import SignupForm from "../components/auth/SignupForm";
import AuthLayout from "../layouts/AuthLayout";

const Signup = () => {
  return (
    <AuthLayout
      title="Create your account"
      description="Get started with TaskFlow and organize your tasks in one place."
      variant="centered"
    >
      <SignupForm />
    </AuthLayout>
  );
};

export default Signup;
