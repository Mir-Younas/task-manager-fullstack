
import { useSearchParams } from "react-router-dom";

import EmailVerificationStatus from "../components/auth/EmailVerificationStatus";
import AuthLayout from "../layouts/AuthLayout";

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  return (
    <AuthLayout
      title="Email verification"
      description="Securely verify your email address to activate your TaskFlow account."
      variant="centered"
    >
      <EmailVerificationStatus key={token ?? "missing"} token={token} />
    </AuthLayout>
  );
};

export default EmailVerification;
