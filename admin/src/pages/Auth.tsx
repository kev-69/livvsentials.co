import { Login } from "@/components/cards/AuthForm";

const Auth = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 sm:py-12 px-4">
      <div className="max-w-md w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6"></h1>
        <Login />
      </div>
    </div>
  );
};

export default Auth;