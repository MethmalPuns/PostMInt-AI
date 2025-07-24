// App.tsx
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { generatePosts } from './lib/api';
import { checkQuota, updateQuota } from './lib/quota';
import { createAddonPurchase } from './lib/payments';

type Post = {
  id: string;
  content: string;
  created_at: string;
};

type User = {
  id: string;
  email: string;
  quota: {
    remaining_posts: number;
    remaining_submits: number;
    last_submit: string | null;
  };
};

type Tone = 'professional' | 'casual' | 'enthusiastic' | 'humorous';
type Audience = 'general' | 'business' | 'tech' | 'creatives';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [businessDesc, setBusinessDesc] = useState('');
  const [postsCount, setPostsCount] = useState(5);
  const [tone, setTone] = useState<Tone>('professional');
  const [audience, setAudience] = useState<Audience>('general');
  const [generatedPosts, setGeneratedPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'generator' | 'pricing' | 'about'>('generator');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const session = supabase.auth.session();
    if (session?.user) {
      fetchUserData(session.user.email!);
    }
  }, []);

  const fetchUserData = async (userEmail: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', userEmail)
      .single();

    if (data) {
      setUser({
        id: data.id,
        email: data.email,
        quota: {
          remaining_posts: data.remaining_posts,
          remaining_submits: data.remaining_submits,
          last_submit: data.last_submit
        }
      });
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (authMode === 'signup') {
        const { user, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (user) {
          // Create user record in database
          await supabase.from('users').insert([
            { 
              id: user.id, 
              email, 
              remaining_posts: 5, 
              remaining_submits: 1 
            }
          ]);
          fetchUserData(email);
        }
      } else {
        const { user, error } = await supabase.auth.signIn({ email, password });
        if (error) throw error;
        if (user) fetchUserData(email);
      }
      setShowAuthModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGeneratePosts = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (businessDesc.length > 600) {
      setError('Business description must be 600 characters or less');
      return;
    }

    if (!user.quota.remaining_submits) {
      setError('No remaining submissions. Please purchase an addon.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check quota first
      const canProceed = await checkQuota(user.id);
      if (!canProceed) {
        setError('API limit reached for today. Please try again tomorrow.');
        return;
      }

      // Generate posts
      const posts = await generatePosts({
        businessDesc,
        postsCount,
        tone,
        audience,
        userId: user.id
      });

      // Update quota
      await updateQuota(user.id, postsCount);

      // Refresh user data
      await fetchUserData(user.email);

      setGeneratedPosts(posts);
      setSuccess(`Successfully generated ${posts.length} posts!`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseAddon = async (addonType: 'posts' | 'submits') => {
    try {
      const paymentUrl = await createAddonPurchase(user!.id, addonType);
      window.location.href = paymentUrl;
    } catch (err) {
      setError(err.message);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              P
            </div>
            <h1 className="text-xl font-bold text-gray-900">PostMint AI</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => setActiveTab('generator')}
              className={`${activeTab === 'generator' ? 'text-indigo-600' : 'text-gray-600'} font-medium`}
            >
              Generator
            </button>
            <button 
              onClick={() => setActiveTab('pricing')}
              className={`${activeTab === 'pricing' ? 'text-indigo-600' : 'text-gray-600'} font-medium`}
            >
              Pricing
            </button>
            <button 
              onClick={() => setActiveTab('about')}
              className={`${activeTab === 'about' ? 'text-indigo-600' : 'text-gray-600'} font-medium`}
            >
              About
            </button>
          </nav>
          <div>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{user.email}</span>
                <button 
                  onClick={() => supabase.auth.signOut()}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-300"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'generator' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                AI-Powered Marketing Posts for X Platform
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
                Generate high-quality, engaging posts tailored to your business in seconds.
              </p>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {success && (
                    <div className="bg-green-50 border-l-4 border-green-400 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-green-700">{success}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label htmlFor="businessDesc" className="block text-sm font-medium text-gray-700">
                      Business Description *
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="businessDesc"
                        name="businessDesc"
                        rows={4}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Describe your business, product, or service (max 600 characters)"
                        value={businessDesc}
                        onChange={(e) => setBusinessDesc(e.target.value)}
                        maxLength={600}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      {businessDesc.length}/600 characters
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div>
                      <label htmlFor="postsCount" className="block text-sm font-medium text-gray-700">
                        Number of Posts
                      </label>
                      <select
                        id="postsCount"
                        name="postsCount"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        value={postsCount}
                        onChange={(e) => setPostsCount(Number(e.target.value))}
                      >
                        <option value="5">5 posts</option>
                        <option value="10">10 posts</option>
                        <option value="15">15 posts</option>
                        <option value="20">20 posts</option>
                        <option value="25">25 posts</option>
                        <option value="30">30 posts</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="tone" className="block text-sm font-medium text-gray-700">
                        Tone
                      </label>
                      <select
                        id="tone"
                        name="tone"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        value={tone}
                        onChange={(e) => setTone(e.target.value as Tone)}
                      >
                        <option value="professional">Professional</option>
                        <option value="casual">Casual</option>
                        <option value="enthusiastic">Enthusiastic</option>
                        <option value="humorous">Humorous</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="audience" className="block text-sm font-medium text-gray-700">
                        Target Audience
                      </label>
                      <select
                        id="audience"
                        name="audience"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        value={audience}
                        onChange={(e) => setAudience(e.target.value as Audience)}
                      >
                        <option value="general">General</option>
                        <option value="business">Business</option>
                        <option value="tech">Tech</option>
                        <option value="creatives">Creatives</option>
                      </select>
                    </div>
                  </div>

                  {user && (
                    <div className="bg-blue-50 p-4 rounded-md">
                      <h3 className="text-sm font-medium text-blue-800">Your Quota</h3>
                      <div className="mt-2 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-blue-700">
                            Remaining Posts: <span className="font-bold">{user.quota.remaining_posts}</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-blue-700">
                            Remaining Submissions: <span className="font-bold">{user.quota.remaining_submits}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                    <div>
                      {!user && (
                        <p className="text-sm text-gray-500">
                          Sign up to get 5 free posts and 1 submission per month.
                        </p>
                      )}
                    </div>
                    <div className="space-x-3">
                      <button
                        type="button"
                        onClick={handleGeneratePosts}
                        disabled={loading || !businessDesc.trim()}
                        className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${(loading || !businessDesc.trim()) ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                          </>
                        ) : (
                          'Generate Posts'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {generatedPosts.length > 0 && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Generated Posts ({generatedPosts.length})
                  </h3>
                </div>
                <div className="bg-gray-50 px-6 py-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {generatedPosts.map((post, index) => (
                      <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flex items-start">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">Post #{index + 1}</p>
                              <p className="mt-1 text-sm text-gray-500 whitespace-pre-wrap">{post.content}</p>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                              <button
                                type="button"
                                onClick={() => copyToClipboard(post.content)}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                Copy
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {user && user.quota.remaining_posts === 0 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      You've used all your free posts this month. <button onClick={() => handlePurchaseAddon('posts')} className="font-medium underline text-yellow-700 hover:text-yellow-600">Purchase an addon</button> to get more.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Simple, Transparent Pricing
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
                Get started for free or upgrade for more capacity.
              </p>
            </div>

            <div className="mt-10 space-y-10 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
              <div className="relative bg-white border-2 border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-8">
                  <h3 className="text-center text-2xl font-medium text-gray-900">Free</h3>
                  <div className="mt-4 flex items-center justify-center">
                    <span className="px-3 flex items-start text-6xl tracking-tight text-gray-900">
                      <span className="mt-2 mr-2 text-4xl font-medium">$</span>
                      <span className="font-extrabold">0</span>
                    </span>
                    <span className="text-xl font-medium text-gray-500">/month</span>
                  </div>
                  <p className="mt-4 text-center text-sm text-gray-500">
                    Perfect for trying out PostMint AI
                  </p>
                </div>
                <div className="border-t-2 border-gray-200 px-6 pt-6 pb-8">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                    What's included
                  </h4>
                  <ul className="mt-6 space-y-4">
                    <li className="flex">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-3 text-base text-gray-500">5 posts per month</span>
                    </li>
                    <li className="flex">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-3 text-base text-gray-500">1 submission per month</span>
                    </li>
                    <li className="flex">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-3 text-base text-gray-500">All post tones</span>
                    </li>
                    <li className="flex">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-3 text-base text-gray-500">All target audiences</span>
                    </li>
                  </ul>
                  <div className="mt-8">
                    {user ? (
                      <div className="rounded-md bg-indigo-50 px-6 py-3 text-center">
                        <p className="text-sm font-medium text-indigo-700">You're currently on the Free plan</p>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowAuthModal(true)}
                        className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-6 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Sign up for free
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative bg-white border-2 border-indigo-500 rounded-2xl shadow-sm overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 bg-white p-2 rounded-full shadow-md transform rotate-12">
                  <svg className="h-8 w-8 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="px-6 py-8">
                  <h3 className="text-center text-2xl font-medium text-gray-900">More Posts</h3>
                  <div className="mt-4 flex items-center justify-center">
                    <span className="px-3 flex items-start text-6xl tracking-tight text-gray-900">
                      <span className="mt-2 mr-2 text-4xl font-medium">$</span>
                      <span className="font-extrabold">5</span>
                    </span>
                    <span className="text-xl font-medium text-gray-500">/one-time</span>
                  </div>
                  <p className="mt-4 text-center text-sm text-gray-500">
                    Get additional posts without new submissions
                  </p>
                </div>
                <div className="border-t-2 border-gray-200 px-6 pt-6 pb-8">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                    What's included
                  </h4>
                  <ul className="mt-6 space-y-4">
                    <li className="flex">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-3 text-base text-gray-500">10 additional posts</span>
                    </li>
                    <li className="flex">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-3 text-base text-gray-500">No new submission required</span>
                    </li>
                    <li className="flex">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-3 text-base text-gray-500">Uses your existing generated posts</span>
                    </li>
                  </ul>
                  <div className="mt-8">
                    <button
                      onClick={() => handlePurchaseAddon('posts')}
                      disabled={!user}
                      className={`w-full bg-indigo-600 border border-transparent rounded-md py-3 px-6 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${!user ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {user ? 'Purchase Addon' : 'Sign in to purchase'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative bg-white border-2 border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-8">
                  <h3 className="text-center text-2xl font-medium text-gray-900">More Submissions</h3>
                  <div className="mt-4 flex items-center justify-center">
                    <span className="px-3 flex items-start text-6xl tracking-tight text-gray-900">
                      <span className="mt-2 mr-2 text-4xl font-medium">$</span>
                      <span className="font-extrabold">5</span>
                    </span>
                    <span className="text-xl font-medium text-gray-500">/one-time</span>
                  </div>
                  <p className="mt-4 text-center text-sm text-gray-500">
                    Get new submissions with posts
                  </p>
                </div>
                <div className="border-t-2 border-gray-200 px-6 pt-6 pb-8">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                    What's included
                  </h4>
                  <ul className="mt-6 space-y-4">
                    <li className="flex">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-3 text-base text-gray-500">1 additional submission</span>
                    </li>
                    <li className="flex">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-3 text-base text-gray-500">5 additional posts</span>
                    </li>
                    <li className="flex">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-3 text-base text-gray-500">Generate new content</span>
                    </li>
                  </ul>
                  <div className="mt-8">
                    <button
                      onClick={() => handlePurchaseAddon('submits')}
                      disabled={!user}
                      className={`w-full bg-indigo-600 border border-transparent rounded-md py-3 px-6 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${!user ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {user ? 'Purchase Addon' : 'Sign in to purchase'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                About PostMint AI
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
                AI-powered marketing content tailored for your business
              </p>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Our Story
                </h3>
              </div>
              <div className="px-6 py-5 bg-white">
                <div className="prose prose-indigo text-gray-500">
                  <p>
                    PostMint AI was born out of frustration with the time-consuming process of creating engaging social media content. As a digital marketer myself, I found myself spending hours crafting posts that would get minimal engagement.
                  </p>
                  <p>
                    I realized that AI could help automate this process while maintaining quality and relevance. After months of experimenting with different AI models and prompt engineering, I developed a system that generates high-quality, platform-optimized posts tailored to specific businesses.
                  </p>
                  <p>
                    Our mission is to help businesses of all sizes maintain an active, engaging social media presence without the time investment typically required.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  How It Works
                </h3>
              </div>
              <div className="px-6 py-5 bg-white">
                <div className="prose prose-indigo text-gray-500">
                  <ol>
                    <li>
                      <strong>Provide your business details:</strong> Describe your business, product, or service in a few sentences.
                    </li>
                    <li>
                      <strong>Select your preferences:</strong> Choose the tone, target audience, and number of posts you need.
                    </li>
                    <li>
                      <strong>Generate content:</strong> Our AI creates multiple post variations based on your input.
                    </li>
                    <li>
                      <strong>Copy and post:</strong> Simply copy the generated posts and use them on your social media platforms.
                    </li>
                  </ol>
                  <p className="mt-4">
                    The AI has been trained with marketing best practices and platform-specific optimizations to ensure your posts perform well.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Share Your Experience
                </h3>
              </div>
              <div className="px-6 py-5 bg-white">
                <div className="prose prose-indigo text-gray-500">
                  <p>
                    We're constantly improving PostMint AI based on user feedback. As an MVP, your experience is incredibly valuable to us.
                  </p>
                  <p className="mt-4">
                    Please share your thoughts on what's working well and what could be improved. Your feedback will directly influence our development roadmap.
                  </p>
                </div>
                <div className="mt-6">
                  <form className="space-y-6">
                    <div>
                      <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">
                        Your Feedback
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="feedback"
                          name="feedback"
                          rows={4}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="What was your experience using PostMint AI?"
                        ></textarea>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email (optional)
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Submit Feedback
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                  <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {authMode === 'signup' ? 'Create an account' : 'Sign in to your account'}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {authMode === 'signup' ? 'Get 5 free posts and 1 submission per month' : 'Enter your credentials to access your account'}
                    </p>
                  </div>
                </div>
              </div>
              <form onSubmit={handleAuth} className="mt-5 space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'}
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <button
                      type="button"
                      onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      {authMode === 'signin' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
                    </button>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {authMode === 'signup' ? 'Sign up' : 'Sign in'}
                  </button>
                </div>
              </form>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}