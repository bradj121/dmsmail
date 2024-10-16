import DmsLogo from '@/app/ui/dms-logo';
import LoginForm from '@/app/ui/signup-form';
 
export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-sm bg-gray-800 p-3 md:h-36">
          <div className="w-32 text-green md:w-36">
            <DmsLogo />
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}