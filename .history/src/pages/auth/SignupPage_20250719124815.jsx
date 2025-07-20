import SignupForm from '../../components/auth/SignupForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
        <img src="https://i.ibb.co/C3r84TzZ/emplogo.png" alt="Staffy-logo" className='h-25 w-40 mb-1 mx-auto rounded-xl'></img>
        <img src="https://cdn.dribbble.com/users/238327/screenshots/2380321/confused_director.gif" className='w-3/4 mx-auto rounded-xl' alt='Employee Signup'/>
        <SignupForm />
      </div>
    </div>
  );
}