const API_URL_ROOT = process.env.NEXT_PUBLIC_API_URL;
import {useState} from 'react'
import ReCAPTCHA from 'react-google-recaptcha';

interface FormProps {
    goLogin: () => void
}

export default function CreateAccountForm(props : FormProps) {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    const handleCreateAccount = async () => {
        if (!username || !email || !password) {
        setMessage('All fields are required.');
        return;
        }

        try {
            const response = await fetch(`${API_URL_ROOT}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                name: username,
                email: email,
                password: password,
                roles: 'user',
                captchaToken
                })
            });
            const data = await response.json();

            if (response.ok) {
                setMessage('Account created. Please check your email to verify your account.');
                setTimeout(() => {
                props.goLogin();
                }, 1500);
            } else {
                setMessage(data.message || 'Error creating account');
            }
        } catch (error: any) {
            console.error('Create account error:', error);
            setMessage(`Server error: ${error.message || 'Unexpected issue occurred. Please try again later.'}`);
        }
    }

    return(
        <div className='bg-white px-10 py-20 rounded-3xl border-2 border-gray-200'>
            <h1 className='text-5xl font-bold '>Bone Database</h1>
            <div className='mt-8 flex justify-center items-center'>
                <button className='text-maroon text-base font-medium active:scale-[.98] active:duration-75 hover:scale-[1.02] 
                ease-in-out transition-all' onClick={props.goLogin}>Back to login</button>
            </div>
            <p className='font-medium text-lg text-gray-500 mt-4'>Please enter new account information:</p>
            <div className='mt-6'>
                <div>
                    <label className='text-lg font-medium'>Username</label>
                    <input 
                        className='w-full border-2 border-gray-200 rounded-xl p-3 mt-1 bg-transparent'
                        placeholder='Enter your username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label className='text-lg font-medium'>Email</label>
                    <input 
                        className='w-full border-2 border-gray-200 rounded-xl p-3 mt-1 bg-transparent'
                        placeholder='Enter your email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className='mt-4'>
                    <label className='text-lg font-medium'>Password</label>
                    <input 
                        className='w-full border-2 border-gray-200 rounded-xl p-3 mt-1 bg-transparent'
                        placeholder='Enter your password'
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {message && (
                <div className='mt-4 text-sm text-red-500 font-medium'>{message}</div>
                )}
            </div>
            <ReCAPTCHA
                sitekey={"6Leint8rAAAAANfcaXKg8YlByf1Da9yCtCyEzClL"}
                onChange={(token) => setCaptchaToken(token)}
            />
            <div className='mt-8 flex justify-center items-center'>
                <button className='text-maroon text-base font-medium active:scale-[.98] active:duration-75 hover:scale-[1.02] 
                ease-in-out transition-all' onClick={handleCreateAccount}>Create Account</button>
            </div>

        </div>
    )
}