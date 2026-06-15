// app/register/page.tsx

import LayoutAuth from "@/components/auth/LayoutAuth";
import FormRegister from "@/components/auth/FormRegister";

export default function RegisterPage() {
  return (
    <LayoutAuth reverse={true}>
      <FormRegister />
    </LayoutAuth>
  );
}