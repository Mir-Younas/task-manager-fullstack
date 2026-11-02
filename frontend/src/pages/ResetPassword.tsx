import { useSearchParams } from "react-router-dom";

import ResetPasswordForm from "../components/auth/ResetPasswordForm";
import AuthLayout from "../layouts/AuthLayout";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  return (
    <AuthLayout
      title="Reset your password"
      description="Create a new password to securely access your TaskFlow account."
      variant="centered"
    >
      <ResetPasswordForm key={token ?? "missing"} token={token} />
    </AuthLayout>
  );
};

export default ResetPassword;
