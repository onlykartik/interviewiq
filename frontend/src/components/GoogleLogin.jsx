import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function GoogleLogin() {
    const { login } = useAuth();

    useEffect(() => {
        /* global google */
        if (!window.google) return;

        window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async (response) => {
            const res = await fetch(
            'http://localhost:8080/api/auth/google',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                token: response.credential
                })
            }
            );

            const data = await res.json();
            login(data.token);
        }
        });

        window.google.accounts.id.renderButton(
        document.getElementById('google-signin'),
        {
            theme: 'outline',
            size: 'large'
        }
        );
    }, []);

    return <div id="google-signin"></div>;
}