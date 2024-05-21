import { useState } from 'react';
import axios from 'axios';

function App() {
    const [url, setUrl] = useState('');
    const [email, setEmail] = useState('');
    const [savedUrl, setSavedUrl] = useState(localStorage.getItem('url') || '');
    const [savedEmail, setSavedEmail] = useState(
        localStorage.getItem('email') || ''
    );

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/api/check-tickets', {
                url,
                email,
            });
            localStorage.setItem('url', url);
            localStorage.setItem('email', email);
            setSavedUrl(url);
            setSavedEmail(email);
            console.log(response.data.message);
        } catch (error) {
            console.error('Error setting URL and email:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="mb-4 text-2xl font-bold">Tixel Ticket Notifier</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Enter the Tixel URL to monitor:
                    </label>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Enter your email address:
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Save
                </button>
            </form>
            {savedUrl && savedEmail && (
                <p className="mt-4 text-sm text-gray-500">
                    Monitoring <strong>{savedUrl}</strong> and will notify{' '}
                    <strong>{savedEmail}</strong> when tickets are available.
                </p>
            )}
        </div>
    );
}

export default App;
