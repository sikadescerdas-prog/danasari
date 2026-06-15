import UsersHeader from "@/components/dashboard/users/UsersHeader";
import UserList from "@/components/dashboard/users/UsersList";

export default function UsersPage() {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <UsersHeader />
      <UserList />
    </div>
  );
}