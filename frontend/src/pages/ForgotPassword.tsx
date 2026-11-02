import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";
import AuthLayout from "../layouts/AuthLayout";

const ForgotPassword = () => {
  return (
    <AuthLayout
      title="Forgot your password?"
      description="Enter your email address and we'll send you a link to reset your password."
      variant="centered"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
};

export default ForgotPassword;
