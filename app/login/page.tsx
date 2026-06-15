// app/login/page.tsx

import LayoutAuth from "@/components/auth/LayoutAuth";
import FormLogin from "@/components/auth/FormLogin";

export default function LoginPage() {
  return (
    <LayoutAuth>
      <FormLogin />
    </LayoutAuth>
  );
} 