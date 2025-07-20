import SignupForm from '../../components/auth/SignupForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <img src="https://i.ibb.co/Y7762g57/Chat-GPT-Image-Jul-19-2025-12-33-04-PM.png" alt="Staffy-logo" className='h-25 w-50 mx-auto rounded-xl'></img>
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
        <img src="https://cdn.dribbble.com/users/238327/screenshots/2380321/confused_director.gif" className='w-3/4 mx-auto rounded-xl' alt='Employee Signup'/>
        <SignupForm />
      </div>
    </div>
  );
}