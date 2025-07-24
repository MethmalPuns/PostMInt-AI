<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PostMint AI | AI-Powered X Platform Post Generator</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
    <script src="https://unpkg.com/@supabase/supabase-js@2"></script>
    <script src="https://js.lemonsqueezy.com/js/lemon.js" defer></script>
    <style>
        /* ======================= */
        /* COLOR THEME CUSTOMIZATION */
        /* ======================= */
        :root {
            /* Primary Colors */
            --color-primary: #6366f1;
            --color-primary-dark: #4f46e5;
            --color-primary-light: #818cf8;
            
            /* Secondary Colors */
            --color-secondary: #f59e0b;
            --color-secondary-dark: #d97706;
            
            /* Backgrounds */
            --color-bg-primary: #f8fafc;
            --color-bg-secondary: #ffffff;
            --color-bg-dark: #1e293b;
            
            /* Text Colors */
            --color-text-primary: #1e293b;
            --color-text-secondary: #64748b;
            --color-text-light: #ffffff;
            
            /* Borders */
            --color-border: #e2e8f0;
            --color-border-dark: #cbd5e1;
            
            /* Buttons */
            --color-btn-primary: var(--color-primary);
            --color-btn-primary-hover: var(--color-primary-dark);
            --color-btn-secondary: var(--color-secondary);
            --color-btn-secondary-hover: var(--color-secondary-dark);
            
            /* Links */
            --color-link: var(--color-primary);
            --color-link-hover: var(--color-primary-dark);
        }
        
        /* ======================= */
        /* BASE STYLES */
        /* ======================= */
        body {
            font-family: 'Inter', sans-serif;
            scroll-behavior: smooth;
            background-color: var(--color-bg-primary);
            color: var(--color-text-primary);
        }
        
        /* Background animation */
        .animated-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background: linear-gradient(-45deg, 
                rgba(var(--color-primary-light-rgb), 0.05) 0%, 
                rgba(var(--color-primary-rgb), 0.03) 50%, 
                rgba(var(--color-secondary-rgb), 0.05) 100%);
            background-size: 400% 400%;
            animation: gradientBG 15s ease infinite;
        }
        
        @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        /* ======================= */
        /* COMPONENT STYLES */
        /* ======================= */
        .btn-primary {
            background-color: var(--color-btn-primary);
            color: white;
            transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
            background-color: var(--color-btn-primary-hover);
            transform: translateY(-1px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .btn-secondary {
            background-color: var(--color-btn-secondary);
            color: white;
            transition: all 0.3s ease;
        }
        
        .btn-secondary:hover {
            background-color: var(--color-btn-secondary-hover);
            transform: translateY(-1px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .btn-outline {
            border: 2px solid var(--color-btn-primary);
            color: var(--color-btn-primary);
            transition: all 0.3s ease;
        }
        
        .btn-outline:hover {
            background-color: var(--color-btn-primary);
            color: white;
        }
        
        .link {
            color: var(--color-link);
            transition: color 0.2s ease;
        }
        
        .link:hover {
            color: var(--color-link-hover);
        }
        
        .card {
            background-color: var(--color-bg-secondary);
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
        }
        
        .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }
        
        .post-card {
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            border: 1px solid var(--color-border);
        }
        
        .post-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
            border-color: var(--color-primary-light);
        }
        
        .copy-btn {
            opacity: 0;
            transition: opacity 0.2s ease;
        }
        
        .post-card:hover .copy-btn {
            opacity: 1;
        }
        
        .character-count {
            transition: color 0.2s ease;
        }
        
        .loading-spinner {
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* Auth wall overlay */
        .auth-wall {
            position: relative;
        }
        
        .auth-wall::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(4px);
            z-index: 10;
            border-radius: 12px;
        }
        
        .auth-wall-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 11;
            text-align: center;
            width: 80%;
        }
        
        /* Story section graphic */
        .story-graphic {
            position: relative;
            width: 100%;
            height: 300px;
            background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
            border-radius: 16px;
            overflow: hidden;
        }
        
        .story-graphic::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
            animation: pulse 8s infinite alternate;
        }
        
        @keyframes pulse {
            0% { transform: scale(0.8); opacity: 0.5; }
            100% { transform: scale(1.2); opacity: 0.8; }
        }
        
        /* Modal styles */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(4px);
        }
        
        .modal-container {
            background: white;
            border-radius: 12px;
            max-width: 90%;
            width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
            .hero-title {
                font-size: 2.5rem;
            }
            
            .hero-subtitle {
                font-size: 1.1rem;
            }
            
            .auth-wall-content {
                width: 90%;
            }
            
            .story-graphic {
                height: 200px;
            }
        }
    </style>
</head>
<body>
    <!-- Animated background -->
    <div class="animated-bg"></div>
    
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white shadow-sm">
        <div class="container mx-auto px-4 py-3 flex justify-between items-center">
            <div class="flex items-center space-x-2">
                <div class="w-10 h-10 flex items-center justify-center text-white font-bold text-xl" style="background-color: var(--color-primary); border-radius: 10px;">
                    PM
                </div>
                <span class="text-xl font-bold" style="color: var(--color-text-primary);">PostMint AI</span>
            </div>
            <p class="text-sm hidden md:block" style="color: var(--color-text-secondary);">AI-powered marketing posts for X platform</p>
            <div id="auth-buttons" class="flex space-x-2">
                <button id="sign-in-btn" class="px-4 py-2 text-sm font-medium" style="color: var(--color-primary);">Sign In</button>
                <button id="sign-up-btn" class="px-4 py-2 text-sm font-medium text-white rounded-md btn-primary">Sign Up</button>
            </div>
            <div id="user-menu" class="hidden items-center space-x-4">
                <span id="user-email" class="text-sm font-medium" style="color: var(--color-text-secondary);"></span>
                <button id="sign-out-btn" class="px-4 py-2 text-sm font-medium" style="color: var(--color-text-secondary);">Sign Out</button>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="py-16 px-4">
        <div class="container mx-auto max-w-4xl text-center">
            <h1 class="hero-title text-4xl md:text-5xl font-bold mb-6 animate__animated animate__fadeIn" style="color: var(--color-text-primary);">
                Craft Perfect X Platform Posts with AI
            </h1>
            <p class="hero-subtitle text-xl mb-10 max-w-3xl mx-auto" style="color: var(--color-text-secondary);">
                Generate engaging, on-brand marketing posts for your business in seconds. Just describe what you do and let our AI do the rest.
            </p>
            <div class="flex justify-center space-x-4">
                <a href="#generator" class="px-6 py-3 btn-primary font-medium rounded-md">
                    Try It Free
                </a>
                <a href="#pricing" class="px-6 py-3 btn-outline font-medium rounded-md">
                    View Plans
                </a>
            </div>
        </div>
    </section>

    <!-- Generator Section -->
    <section id="generator" class="py-12 px-4">
        <div class="container mx-auto max-w-4xl">
            <div class="card overflow-hidden auth-wall" id="generator-container">
                <!-- Auth wall content (shown when not logged in) -->
                <div class="auth-wall-content hidden" id="auth-wall-content">
                    <h3 class="text-xl font-bold mb-4" style="color: var(--color-text-primary);">Sign In to Generate Posts</h3>
                    <p class="mb-6" style="color: var(--color-text-secondary);">Create an account or sign in to start generating marketing posts for your business.</p>
                    <div class="flex justify-center space-x-4">
                        <button id="wall-sign-in-btn" class="px-6 py-2 btn-primary rounded-md">Sign In</button>
                        <button id="wall-sign-up-btn" class="px-6 py-2 btn-outline rounded-md">Sign Up</button>
                    </div>
                </div>
                
                <div class="p-6">
                    <h2 class="text-2xl font-bold mb-4" style="color: var(--color-text-primary);">Generate Your Posts</h2>
                    <div id="free-tier-info" class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                        <div class="flex items-start">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm text-blue-700">
                                    <span id="remaining-posts">5</span> free posts remaining this month. <span id="remaining-submits">1</span> submit chance left.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <form id="post-form" class="space-y-6">
                        <div>
                            <label for="business-description" class="block text-sm font-medium mb-1" style="color: var(--color-text-primary);">
                                Business/Brand Description
                            </label>
                            <textarea 
                                id="business-description" 
                                rows="4" 
                                maxlength="600"
                                class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50"
                                style="border-color: var(--color-border); focus:ring-color: var(--color-primary);"
                                placeholder="Describe your business, product, or service in detail (max 600 characters)"></textarea>
                            <div class="flex justify-between mt-1">
                                <p class="text-xs" style="color: var(--color-text-secondary);">Be specific for better results</p>
                                <p class="text-xs" style="color: var(--color-text-secondary);"><span id="char-count">0</span>/600 characters</p>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label for="post-count" class="block text-sm font-medium mb-1" style="color: var(--color-text-primary);">
                                    Number of Posts
                                </label>
                                <select id="post-count" class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50"
                                style="border-color: var(--color-border); focus:ring-color: var(--color-primary);">
                                    <option value="1">1 post</option>
                                    <option value="3">3 posts</option>
                                    <option value="5">5 posts</option>
                                </select>
                            </div>
                            
                            <div>
                                <label for="tone" class="block text-sm font-medium mb-1" style="color: var(--color-text-primary);">
                                    Tone
                                </label>
                                <select id="tone" class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50"
                                style="border-color: var(--color-border); focus:ring-color: var(--color-primary);">
                                    <option value="professional">Professional</option>
                                    <option value="casual">Casual</option>
                                    <option value="enthusiastic">Enthusiastic</option>
                                    <option value="humorous">Humorous</option>
                                    <option value="informative">Informative</option>
                                </select>
                            </div>
                            
                            <div>
                                <label for="audience" class="block text-sm font-medium mb-1" style="color: var(--color-text-primary);">
                                    Target Audience
                                </label>
                                <select id="audience" class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50"
                                style="border-color: var(--color-border); focus:ring-color: var(--color-primary);">
                                    <option value="general">General Public</option>
                                    <option value="business">Business Professionals</option>
                                    <option value="tech">Tech Enthusiasts</option>
                                    <option value="young">Young Adults</option>
                                </select>
                            </div>
                        </div>
                        
                        <div>
                            <button type="submit" id="generate-btn" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white btn-primary">
                                Generate Posts
                            </button>
                            <button id="loading-btn" class="hidden w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white"
                            style="background-color: var(--color-primary-light);">
                                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </button>
                        </div>
                    </form>
                </div>
                
                <!-- Results Section -->
                <div id="results-section" class="hidden border-t p-6" style="border-color: var(--color-border);">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-medium" style="color: var(--color-text-primary);">Your Generated Posts</h3>
                        <div class="text-sm" style="color: var(--color-text-secondary);">
                            <span id="shown-posts-count">0</span> of <span id="total-posts-count">0</span> shown
                        </div>
                    </div>
                    
                    <div id="posts-container" class="grid grid-cols-1 gap-4">
                        <!-- Posts will be inserted here -->
                    </div>
                    
                    <div id="more-posts-section" class="mt-6 hidden">
                        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                            <div class="flex">
                                <div class="flex-shrink-0">
                                    <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <div class="ml-3">
                                    <p class="text-sm text-yellow-700">
                                        You've used all your free posts. To see more, purchase an addon package below.
                                    </p>
                                    <div class="mt-2">
                                        <a href="#pricing" class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-yellow-700 bg-yellow-100 hover:bg-yellow-200">
                                            View Addons
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-12 px-4" style="background-color: var(--color-bg-secondary);">
        <div class="container mx-auto max-w-4xl">
            <h2 class="text-3xl font-bold text-center mb-12" style="color: var(--color-text-primary);">How PostMint AI Works</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="text-center">
                    <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-md mb-4"
                    style="background-color: var(--color-primary-light); color: var(--color-primary);">
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-medium mb-2" style="color: var(--color-text-primary);">Describe Your Business</h3>
                    <p class="text-sm" style="color: var(--color-text-secondary);">Provide details about your brand, product, or service in simple terms.</p>
                </div>
                
                <div class="text-center">
                    <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-md mb-4"
                    style="background-color: var(--color-primary-light); color: var(--color-primary);">
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-medium mb-2" style="color: var(--color-text-primary);">Customize Your Preferences</h3>
                    <p class="text-sm" style="color: var(--color-text-secondary);">Select tone, target audience, and number of posts you need.</p>
                </div>
                
                <div class="text-center">
                    <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-md mb-4"
                    style="background-color: var(--color-primary-light); color: var(--color-primary);">
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-medium mb-2" style="color: var(--color-text-primary);">Get AI-Generated Posts</h3>
                    <p class="text-sm" style="color: var(--color-text-secondary);">Receive optimized, engaging posts ready to share on X platform.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Backstory Section -->
    <section class="py-12 px-4">
        <div class="container mx-auto max-w-4xl">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div class="story-graphic flex items-center justify-center">
                    <div class="relative z-10 text-center p-6">
                        <h3 class="text-2xl font-bold text-white mb-2">Our Journey</h3>
                        <p class="text-white opacity-90">From idea to AI-powered solution</p>
                    </div>
                </div>
                
                <div>
                    <h2 class="text-3xl font-bold mb-6" style="color: var(--color-text-primary);">Our Story</h2>
                    <div class="space-y-4" style="color: var(--color-text-secondary);">
                        <p>As digital marketers ourselves, we struggled to consistently create engaging, on-brand content for our clients. The creative process was time-consuming, and maintaining a steady stream of quality posts was challenging.</p>
                        <p>That's when we realized the potential of AI to revolutionize content creation. We built PostMint AI to help businesses like yours maintain an active, professional presence on X platform without the hassle of constant content creation.</p>
                        <p>Our AI is trained on thousands of successful marketing posts across various industries, ensuring that your generated content follows proven engagement patterns while staying true to your unique brand voice.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-12 px-4" style="background-color: var(--color-bg-secondary);">
        <div class="container mx-auto max-w-4xl">
            <h2 class="text-3xl font-bold text-center mb-12" style="color: var(--color-text-primary);">Simple, Transparent Pricing</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Free Tier -->
                <div class="card overflow-hidden">
                    <div class="px-6 py-8">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-2xl font-bold" style="color: var(--color-text-primary);">Free Tier</h3>
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                            style="background-color: var(--color-primary-light); color: var(--color-primary);">
                                Always Free
                            </span>
                        </div>
                        <p class="mb-6" style="color: var(--color-text-secondary);">Perfect for trying out PostMint AI</p>
                        <div class="mb-6">
                            <span class="text-4xl font-bold" style="color: var(--color-text-primary);">$0</span>
                            <span style="color: var(--color-text-secondary);">/month</span>
                        </div>
                        <ul class="space-y-3 mb-8">
                            <li class="flex items-start">
                                <svg class="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                </svg>
                                <span style="color: var(--color-text-secondary);">5 posts per month</span>
                            </li>
                            <li class="flex items-start">
                                <svg class="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                </svg>
                                <span style="color: var(--color-text-secondary);">1 submit chance</span>
                            </li>
                            <li class="flex items-start">
                                <svg class="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                </svg>
                                <span style="color: var(--color-text-secondary);">All tone options</span>
                            </li>
                        </ul>
                        <button class="w-full px-6 py-3 font-medium rounded-md btn-outline">
                            Current Plan
                        </button>
                    </div>
                </div>
                
                <!-- Addon Packages -->
                <div class="card overflow-hidden">
                    <div class="px-6 py-8">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-2xl font-bold" style="color: var(--color-text-primary);">Addon Packages</h3>
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                            style="background-color: var(--color-secondary-light); color: var(--color-secondary-dark);">
                                Flexible Options
                            </span>
                        </div>
                        <p class="mb-6" style="color: var(--color-text-secondary);">Boost your post generation capacity</p>
                        
                        <!-- Addon 1 -->
                        <div class="mb-6 p-4 border rounded-lg" style="border-color: var(--color-border);">
                            <div class="flex justify-between items-start mb-2">
                                <h4 class="text-lg font-medium" style="color: var(--color-text-primary);">More Posts</h4>
                                <span class="text-lg font-bold" style="color: var(--color-text-primary);">$5</span>
                            </div>
                            <p class="text-sm mb-3" style="color: var(--color-text-secondary);">Get 10 additional posts from your existing generated content</p>
                            <ul class="text-sm space-y-1 mb-4" style="color: var(--color-text-secondary);">
                                <li class="flex items-start">
                                    <svg class="h-4 w-4 text-green-500 mr-1 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                    </svg>
                                    <span>Access 10 more posts from your stored results</span>
                                </li>
                                <li class="flex items-start">
                                    <svg class="h-4 w-4 text-green-500 mr-1 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                    </svg>
                                    <span>No additional API calls needed</span>
                                </li>
                            </ul>
                            <button id="addon-1-btn" class="w-full px-4 py-2 text-sm font-medium rounded-md btn-primary">
                                Purchase Addon
                            </button>
                            <p class="text-xs mt-1" style="color: var(--color-text-secondary);">Max 3 purchases per user (30 posts total)</p>
                        </div>
                        
                        <!-- Addon 2 -->
                        <div class="p-4 border rounded-lg" style="border-color: var(--color-border);">
                            <div class="flex justify-between items-start mb-2">
                                <h4 class="text-lg font-medium" style="color: var(--color-text-primary);">New Input + Posts</h4>
                                <span class="text-lg font-bold" style="color: var(--color-text-primary);">$5</span>
                            </div>
                            <p class="text-sm mb-3" style="color: var(--color-text-secondary);">Submit a new business description and get 5 fresh posts</p>
                            <ul class="text-sm space-y-1 mb-4" style="color: var(--color-text-secondary);">
                                <li class="flex items-start">
                                    <svg class="h-4 w-4 text-green-500 mr-1 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                    </svg>
                                    <span>1 additional submit chance</span>
                                </li>
                                <li class="flex items-start">
                                    <svg class="h-4 w-4 text-green-500 mr-1 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                    </svg>
                                    <span>5 new AI-generated posts</span>
                                </li>
                            </ul>
                            <button id="addon-2-btn" class="w-full px-4 py-2 text-sm font-medium rounded-md btn-primary">
                                Purchase Addon
                            </button>
                            <p id="api-limit-warning" class="hidden text-xs mt-1 text-red-500">Temporarily unavailable due to API limits. Check back later.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Feedback Section -->
    <section class="py-12 px-4">
        <div class="container mx-auto max-w-4xl">
            <div class="card p-8">
                <h2 class="text-3xl font-bold text-center mb-6" style="color: var(--color-text-primary);">Share Your Experience</h2>
                <p class="text-center mb-8 max-w-2xl mx-auto" style="color: var(--color-text-secondary);">
                    We'd love to hear your feedback about PostMint AI. Your insights help us improve the tool for everyone.
                </p>
                
                <form id="feedback-form" class="space-y-6 max-w-2xl mx-auto">
                    <div>
                        <label for="feedback-name" class="block text-sm font-medium mb-1" style="color: var(--color-text-primary);">Your Name</label>
                        <input type="text" id="feedback-name" class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50"
                        style="border-color: var(--color-border); focus:ring-color: var(--color-primary);">
                    </div>
                    
                    <div>
                        <label for="feedback-email" class="block text-sm font-medium mb-1" style="color: var(--color-text-primary);">Your Email (optional)</label>
                        <input type="email" id="feedback-email" class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50"
                        style="border-color: var(--color-border); focus:ring-color: var(--color-primary);">
                    </div>
                    
                    <div>
                        <label for="feedback-text" class="block text-sm font-medium mb-1" style="color: var(--color-text-primary);">Your Feedback</label>
                        <textarea id="feedback-text" rows="4" class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50"
                        style="border-color: var(--color-border); focus:ring-color: var(--color-primary);"></textarea>
                    </div>
                    
                    <div class="flex justify-center">
                        <button type="submit" class="px-6 py-3 btn-primary rounded-md">
                            Submit Feedback
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-12 px-4" style="background-color: var(--color-bg-secondary);">
        <div class="container mx-auto max-w-4xl">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold mb-4" style="color: var(--color-text-primary);">What Our Users Say</h2>
                <p class="text-xl max-w-3xl mx-auto" style="color: var(--color-text-secondary);">
                    Don't just take our word for it - hear from businesses using PostMint AI
                </p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="card p-6">
                    <div class="flex items-center mb-4">
                        <div class="h-10 w-10 rounded-full flex items-center justify-center font-bold mr-3"
                        style="background-color: var(--color-primary-light); color: var(--color-primary);">
                            S
                        </div>
                        <div>
                            <h4 class="font-medium" style="color: var(--color-text-primary);">Sarah J.</h4>
                            <p class="text-sm" style="color: var(--color-text-secondary);">E-commerce Owner</p>
                        </div>
                    </div>
                    <p style="color: var(--color-text-secondary);">
                        "PostMint AI has saved me hours each week. The posts are so well-crafted that my engagement has increased by 40% since I started using them."
                    </p>
                </div>
                
                <div class="card p-6">
                    <div class="flex items-center mb-4">
                        <div class="h-10 w-10 rounded-full flex items-center justify-center font-bold mr-3"
                        style="background-color: var(--color-primary-light); color: var(--color-primary);">
                            M
                        </div>
                        <div>
                            <h4 class="font-medium" style="color: var(--color-text-primary);">Michael T.</h4>
                            <p class="text-sm" style="color: var(--color-text-secondary);">SaaS Founder</p>
                        </div>
                    </div>
                    <p style="color: var(--color-text-secondary);">
                        "As a solo founder, maintaining social media was overwhelming. Now I get professional-quality posts in minutes. The AI really understands my tech audience."
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Auth Modal -->
    <!--<div id="auth-modal" class="modal-overlay hidden">
        <div class="modal-container">
            <div class="p-6">
                <div class="sm:flex sm:items-start">
                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <h3 class="text-lg leading-6 font-medium mb-6" id="auth-modal-title" style="color: var(--color-text-primary);">Sign In</h3>
                        <div class="mt-2">
                            <form id="auth-form" class="space-y-6">
                                <div id="auth-error" class="hidden bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                                    <div class="flex">
                                        <div class="flex-shrink-0">
                                            <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                        <div class="ml-3">
                                            <p class="text-sm text-red-700" id="auth-error-message"></p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <label for="auth-email" class="block text-sm font-medium mb-1" style="color: var(--color-text-primary);">Email</label>
                                    <input type="email" id="auth-email" class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50"
                                    style="border-color: var(--color-border); focus:ring-color: var(--color-primary);">
                                </div>
                                
                                <div>
                                    <label for="auth-password" class="block text-sm font-medium mb-1" style="color: var(--color-text-primary);">Password</label>
                                    <input type="password" id="auth-password" class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50"
                                    style="border-color: var(--color-border); focus:ring-color: var(--color-primary);">
                                </div>
                                
                                <div id="auth-confirm-password-container" class="hidden">
                                    <label for="auth-confirm-password" class="block text-sm font-medium mb-1" style="color: var(--color-text-primary);">Confirm Password</label>
                                    <input type="password" id="auth-confirm-password" class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50"
                                    style="border-color: var(--color-border); focus:ring-color: var(--color-primary);">
                                </div>
                                
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center">
                                        <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 rounded focus:ring-opacity-50"
                                        style="border-color: var(--color-border); focus:ring-color: var(--color-primary);">
                                        <label for="remember-me" class="ml-2 block text-sm" style="color: var(--color-text-primary);">Remember me</label>
                                    </div>
                                    
                                    <div class="text-sm">
                                        <a href="#" id="auth-toggle-link" class="font-medium link"></a>
                                    </div>
                                </div>
                                
                                <div>
                                    <button type="submit" id="auth-submit-btn" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white btn-primary">
                                        Sign In
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div class="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse" style="background-color: var(--color-bg-primary);">
                <button type="button" id="auth-close-btn" class="mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium sm:ml-3 sm:w-auto sm:text-sm"
                style="border-color: var(--color-border); color: var(--color-text-primary); background-color: var(--color-bg-secondary);">
                    Close
                </button>
            </div>
        </div>
    </div>-->

    <!-- Terms Modal -->
   <!--<div id="terms-modal" class="modal-overlay hidden">
        <div class="modal-container">
            <div class="p-6">
                <h3 class="text-lg leading-6 font-medium mb-4" style="color: var(--color-text-primary);">Terms of Service</h3>
                <div class="prose max-h-[60vh] overflow-y-auto" style="color: var(--color-text-secondary);">
                    <h4>1. Acceptance of Terms</h4>
                    <p>By accessing or using PostMint AI, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.</p>
                    
                    <h4>2. Description of Service</h4>
                    <p>PostMint AI provides AI-generated marketing content for social media platforms. The service includes both free and paid features as described on our website.</p>
                    
                    <h4>3. User Responsibilities</h4>
                    <p>You are responsible for all content generated using your account and for ensuring it complies with all applicable laws and platform guidelines.</p>
                    
                    <h4>4. Subscription and Payments</h4>
                    <p>Paid features require a valid payment method. All payments are non-refundable except as required by law.</p>
                    
                    <h4>5. Limitation of Liability</h4>
                    <p>PostMint AI shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the service.</p>
                    
                    <h4>6. Modifications to Terms</h4>
                    <p>We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.</p>
                </div>
            </div>
            <div class="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse" style="background-color: var(--color-bg-primary);">
                <button type="button" id="terms-close-btn" class="mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium sm:ml-3 sm:w-auto sm:text-sm"
                style="border-color: var(--color-border); color: var(--color-text-primary); background-color: var(--color-bg-secondary);">
                    Close
                </button>
            </div>
        </div>
    </div>-->

    <!-- Privacy Modal -->
    <!--<div id="privacy-modal" class="modal-overlay hidden">
        <div class="modal-container">
            <div class="p-6">
                <h3 class="text-lg leading-6 font-medium mb-4" style="color: var(--color-text-primary);">Privacy Policy</h3>
                <div class="prose max-h-[60vh] overflow-y-auto" style="color: var(--color-text-secondary);">
                    <h4>1. Information We Collect</h4>
                    <p>We collect information you provide when creating an account, generating content, or making purchases. This may include email, payment information, and content preferences.</p>
                    
                    <h4>2. How We Use Information</h4>
                    <p>Your information is used to provide and improve our services, process transactions, and communicate with you. We do not sell your personal information to third parties.</p>
                    
                    <h4>3. Data Security</h4>
                    <p>We implement security measures to protect your information. However, no method of transmission over the Internet is 100% secure.</p>
                    
                    <h4>4. Cookies and Tracking</h4>
                    <p>We use cookies to enhance your experience and analyze service usage. You can disable cookies in your browser settings.</p>
                    
                    <h4>5. Third-Party Services</h4>
                    <p>We may use third-party services for payment processing, analytics, and other functions. These services have their own privacy policies.</p>
                    
                    <h4>6. Changes to This Policy</h4>
                    <p>We may update this policy periodically. Continued use of the service after changes constitutes acceptance of the updated policy.</p>
                </div>
            </div>
            <div class="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse" style="background-color: var(--color-bg-primary);">
                <button type="button" id="privacy-close-btn" class="mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium sm:ml-3 sm:w-auto sm:text-sm"
                style="border-color: var(--color-border); color: var(--color-text-primary); background-color: var(--color-bg-secondary);">
                    Close
                </button>
            </div>
        </div>
    </div>-->

    <!-- Footer -->
    <footer class="border-t py-8 px-4" style="border-color: var(--color-border); background-color: var(--color-bg-secondary);">
        <div class="container mx-auto max-w-4xl">
            <div class="flex flex-col md:flex-row justify-between items-center">
                <div class="flex items-center space-x-2 mb-4 md:mb-0">
                    <div class="w-8 h-8 flex items-center justify-center text-white font-bold text-sm"
                    style="background-color: var(--color-primary); border-radius: 8px;">
                        PM
                    </div>
                    <span class="text-lg font-bold" style="color: var(--color-text-primary);">PostMint AI</span>
                </div>
                
                <div class="flex space-x-6">
                    <a href="#" id="terms-link" class="text-sm link">Terms</a>
                    <a href="#" id="privacy-link" class="text-sm link">Privacy</a>
                    <a href="#feedback" class="text-sm link">Contact</a>
                </div>
            </div>
            
            <div class="mt-8 pt-8 border-t text-center text-sm"
            style="border-color: var(--color-border); color: var(--color-text-secondary);">
                <p>© 2023 PostMint AI. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script>
        // Supabase initialization
        const supabaseUrl = 'YOUR_SUPABASE_URL';
        const supabaseKey = 'YOUR_SUPABASE_KEY';
        const supabase = supabase.createClient(supabaseUrl, supabaseKey);
        
        // DOM Elements
        const authButtons = document.getElementById('auth-buttons');
        const userMenu = document.getElementById('user-menu');
        const userEmail = document.getElementById('user-email');
        const signInBtn = document.getElementById('sign-in-btn');
        const signUpBtn = document.getElementById('sign-up-btn');
        const signOutBtn = document.getElementById('sign-out-btn');
        const authModal = document.getElementById('auth-modal');
        const authModalTitle = document.getElementById('auth-modal-title');
        const authForm = document.getElementById('auth-form');
        const authSubmitBtn = document.getElementById('auth-submit-btn');
        const authToggleLink = document.getElementById('auth-toggle-link');
        const authCloseBtn = document.getElementById('auth-close-btn');
        const authEmail = document.getElementById('auth-email');
        const authPassword = document.getElementById('auth-password');
        const authConfirmPasswordContainer = document.getElementById('auth-confirm-password-container');
        const authConfirmPassword = document.getElementById('auth-confirm-password');
        const authError = document.getElementById('auth-error');
        const authErrorMessage = document.getElementById('auth-error-message');
        
        const generatorContainer = document.getElementById('generator-container');
        const authWallContent = document.getElementById('auth-wall-content');
        const wallSignInBtn = document.getElementById('wall-sign-in-btn');
        const wallSignUpBtn = document.getElementById('wall-sign-up-btn');
        
        const postForm = document.getElementById('post-form');
        const businessDescription = document.getElementById('business-description');
        const postCount = document.getElementById('post-count');
        const tone = document.getElementById('tone');
        const audience = document.getElementById('audience');
        const generateBtn = document.getElementById('generate-btn');
        const loadingBtn = document.getElementById('loading-btn');
        const resultsSection = document.getElementById('results-section');
        const postsContainer = document.getElementById('posts-container');
        const morePostsSection = document.getElementById('more-posts-section');
        const shownPostsCount = document.getElementById('shown-posts-count');
        const totalPostsCount = document.getElementById('total-posts-count');
        const remainingPosts = document.getElementById('remaining-posts');
        const remainingSubmits = document.getElementById('remaining-submits');
        const charCount = document.getElementById('char-count');
        
        const addon1Btn = document.getElementById('addon-1-btn');
        const addon2Btn = document.getElementById('addon-2-btn');
        const apiLimitWarning = document.getElementById('api-limit-warning');
        
        const feedbackForm = document.getElementById('feedback-form');
        const feedbackName = document.getElementById('feedback-name');
        const feedbackEmail = document.getElementById('feedback-email');
        const feedbackText = document.getElementById('feedback-text');
        
        const termsModal = document.getElementById('terms-modal');
        const termsLink = document.getElementById('terms-link');
        const termsCloseBtn = document.getElementById('terms-close-btn');
        
        const privacyModal = document.getElementById('privacy-modal');
        const privacyLink = document.getElementById('privacy-link');
        const privacyCloseBtn = document.getElementById('privacy-close-btn');
        
        // State
        let isSignUp = false;
        let currentUser = null;
        let userQuota = {
            remainingPosts: 5,
            remainingSubmits: 1,
            purchasedPosts: 0,
            purchasedSubmits: 0,
            cachedPosts: [],
            apiCallsToday: 0
        };
        
        // Initialize theme colors
        function initializeTheme() {
            // Convert hex colors to RGB for the background animation
            const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
            const primaryLightColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-light');
            const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-secondary');
            
            document.documentElement.style.setProperty('--color-primary-rgb', hexToRgb(primaryColor));
            document.documentElement.style.setProperty('--color-primary-light-rgb', hexToRgb(primaryLightColor));
            document.documentElement.style.setProperty('--color-secondary-rgb', hexToRgb(secondaryColor));
        }
        
        function hexToRgb(hex) {
            // Remove # if present
            hex = hex.replace('#', '');
            
            // Parse r, g, b values
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            
            return `${r}, ${g}, ${b}`;
        }
        
        // Character count
        businessDescription.addEventListener('input', () => {
            charCount.textContent = businessDescription.value.length;
            
            if (businessDescription.value.length > 550) {
                charCount.classList.add('text-yellow-600');
            } else {
                charCount.classList.remove('text-yellow-600');
            }
            
            if (businessDescription.value.length >= 600) {
                charCount.classList.add('text-red-600');
            } else {
                charCount.classList.remove('text-red-600');
            }
        });
        
        // Auth toggle
        authToggleLink.addEventListener('click', (e) => {
            e.preventDefault();
            isSignUp = !isSignUp;
            toggleAuthMode();
        });
        
        function toggleAuthMode() {
            if (isSignUp) {
                authModalTitle.textContent = 'Sign Up';
                authSubmitBtn.textContent = 'Sign Up';
                authToggleLink.textContent = 'Already have an account? Sign In';
                authConfirmPasswordContainer.classList.remove('hidden');
            } else {
                authModalTitle.textContent = 'Sign In';
                authSubmitBtn.textContent = 'Sign In';
                authToggleLink.textContent = "Don't have an account? Sign Up";
                authConfirmPasswordContainer.classList.add('hidden');
            }
            
            authError.classList.add('hidden');
        }
        
        // Auth modal
        signInBtn.addEventListener('click', () => {
            isSignUp = false;
            toggleAuthMode();
            authModal.classList.remove('hidden');
        });
        
        signUpBtn.addEventListener('click', () => {
            isSignUp = true;
            toggleAuthMode();
            authModal.classList.remove('hidden');
        });
        
        wallSignInBtn.addEventListener('click', () => {
            isSignUp = false;
            toggleAuthMode();
            authModal.classList.remove('hidden');
        });
        
        wallSignUpBtn.addEventListener('click', () => {
            isSignUp = true;
            toggleAuthMode();
            authModal.classList.remove('hidden');
        });
        
        authCloseBtn.addEventListener('click', () => {
            authModal.classList.add('hidden');
        });
        
        // Terms and privacy modals
        termsLink.addEventListener('click', (e) => {
            e.preventDefault();
            termsModal.classList.remove('hidden');
        });
        
        termsCloseBtn.addEventListener('click', () => {
            termsModal.classList.add('hidden');
        });
        
        privacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            privacyModal.classList.remove('hidden');
        });
        
        privacyCloseBtn.addEventListener('click', () => {
            privacyModal.classList.add('hidden');
        });
        
        // Auth form submission
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = authEmail.value;
            const password = authPassword.value;
            const confirmPassword = authConfirmPassword.value;
            
            authError.classList.add('hidden');
            
            if (isSignUp) {
                if (password !== confirmPassword) {
                    showAuthError('Passwords do not match');
                    return;
                }
                
                if (password.length < 6) {
                    showAuthError('Password must be at least 6 characters');
                    return;
                }
                
                try {
                    const { user, error } = await supabase.auth.signUp({
                        email,
                        password
                    });
                    
                    if (error) throw error;
                    
                    // Initialize user quota in database
                    const { data, error: quotaError } = await supabase
                        .from('user_quotas')
                        .insert([
                            { 
                                user_id: user.id, 
                                remaining_posts: 5, 
                                remaining_submits: 1,
                                purchased_posts: 0,
                                purchased_submits: 0,
                                cached_posts: [],
                                api_calls_today: 0,
                                last_api_call_date: new Date().toISOString().split('T')[0]
                            }
                        ]);
                    
                    if (quotaError) throw quotaError;
                    
                    alert('Sign up successful! Please check your email for confirmation.');
                    authModal.classList.add('hidden');
                } catch (error) {
                    showAuthError(error.message);
                }
            } else {
                try {
                    const { user, error } = await supabase.auth.signInWithPassword({
                        email,
                        password
                    });
                    
                    if (error) throw error;
                    
                    currentUser = user;
                    await loadUserQuota();
                    updateUIAfterAuth();
                    authModal.classList.add('hidden');
                } catch (error) {
                    showAuthError(error.message);
                }
            }
        });
        
        // Sign out
        signOutBtn.addEventListener('click', async () => {
            try {
                const { error } = await supabase.auth.signOut();
                if (error) throw error;
                
                currentUser = null;
                userQuota = {
                    remainingPosts: 5,
                    remainingSubmits: 1,
                    purchasedPosts: 0,
                    purchasedSubmits: 0,
                    cachedPosts: [],
                    apiCallsToday: 0
                };
                
                updateUIAfterAuth();
            } catch (error) {
                console.error('Error signing out:', error.message);
            }
        });
        
        function showAuthError(message) {
            authErrorMessage.textContent = message;
            authError.classList.remove('hidden');
        }
        
        // Check auth state on load
        async function checkAuthState() {
            const { data: { user }, error } = await supabase.auth.getUser();
            
            if (user) {
                currentUser = user;
                await loadUserQuota();
                updateUIAfterAuth();
            }
        }
        
        async function loadUserQuota() {
            try {
                // Check if we need to reset daily API calls
                const today = new Date().toISOString().split('T')[0];
                
                const { data: quotaData, error: quotaError } = await supabase
                    .from('user_quotas')
                    .select('*')
                    .eq('user_id', currentUser.id)
                    .single();
                
                if (quotaError) throw quotaError;
                
                // Reset API calls if it's a new day
                if (quotaData.last_api_call_date !== today) {
                    const { data: updateData, error: updateError } = await supabase
                        .from('user_quotas')
                        .update({ 
                            api_calls_today: 0,
                            last_api_call_date: today 
                        })
                        .eq('user_id', currentUser.id);
                    
                    if (updateError) throw updateError;
                    
                    quotaData.api_calls_today = 0;
                }
                
                userQuota = {
                    remainingPosts: quotaData.remaining_posts,
                    remainingSubmits: quotaData.remaining_submits,
                    purchasedPosts: quotaData.purchased_posts,
                    purchasedSubmits: quotaData.purchased_submits,
                    cachedPosts: quotaData.cached_posts || [],
                    apiCallsToday: quotaData.api_calls_today
                };
                
                updateQuotaUI();
                
                // Check if we're close to API limit (100 calls/day)
                if (userQuota.apiCallsToday >= 90) {
                    apiLimitWarning.classList.remove('hidden');
                    addon2Btn.disabled = true;
                } else {
                    apiLimitWarning.classList.add('hidden');
                    addon2Btn.disabled = false;
                }
            } catch (error) {
                console.error('Error loading user quota:', error.message);
            }
        }
        
        function updateUIAfterAuth() {
            if (currentUser) {
                authButtons.classList.add('hidden');
                userMenu.classList.remove('hidden');
                userEmail.textContent = currentUser.email;
                
                // Remove auth wall
                generatorContainer.classList.remove('auth-wall');
                authWallContent.classList.add('hidden');
            } else {
                authButtons.classList.remove('hidden');
                userMenu.classList.add('hidden');
                
                // Add auth wall
                generatorContainer.classList.add('auth-wall');
                authWallContent.classList.remove('hidden');
            }
            
            updateQuotaUI();
        }
        
        function updateQuotaUI() {
            if (currentUser) {
                remainingPosts.textContent = userQuota.remainingPosts + (userQuota.purchasedPosts > 0 ? ` + ${userQuota.purchasedPosts} (addon)` : '');
                remainingSubmits.textContent = userQuota.remainingSubmits + (userQuota.purchasedSubmits > 0 ? ` + ${userQuota.purchasedSubmits} (addon)` : '');
            } else {
                remainingPosts.textContent = '5';
                remainingSubmits.textContent = '1';
            }
        }
        
        // Post form submission
        postForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!currentUser) {
                alert('Please sign in to generate posts');
                authModal.classList.remove('hidden');
                return;
            }
            
            const description = businessDescription.value.trim();
            const count = parseInt(postCount.value);
            const selectedTone = tone.value;
            const selectedAudience = audience.value;
            
            if (!description) {
                alert('Please enter a business description');
                return;
            }
            
            if (description.length > 600) {
                alert('Description must be 600 characters or less');
                return;
            }
            
            // Check if user has submit chances left
            const totalSubmits = userQuota.remainingSubmits + userQuota.purchasedSubmits;
            if (totalSubmits <= 0) {
                alert('No submit chances left. Please purchase an addon to get more.');
                return;
            }
            
            // Check if user has enough posts left
            const totalPosts = userQuota.remainingPosts + userQuota.purchasedPosts;
            if (count > totalPosts) {
                alert(`You only have ${totalPosts} posts remaining. Please reduce the number of posts or purchase an addon.`);
                return;
            }
            
            // Check if we have cached posts that can fulfill this request
            if (userQuota.cachedPosts.length >= count) {
                showCachedPosts(count);
                return;
            }
            
            // Otherwise, call the API
            try {
                generateBtn.classList.add('hidden');
                loadingBtn.classList.remove('hidden');
                
                // First check if we can make an API call today
                if (userQuota.apiCallsToday >= 100) {
                    throw new Error('Daily API limit reached. Please try again tomorrow.');
                }
                
                // Call our edge function to generate posts
                const { data, error } = await supabase.functions.invoke('generate-posts', {
                    body: {
                        description,
                        tone: selectedTone,
                        audience: selectedAudience
                    }
                });
                
                if (error) throw error;
                
                // The API returns 35 posts at once
                const generatedPosts = data.posts;
                
                // Update user quota in database
                const newApiCalls = userQuota.apiCallsToday + 1;
                const newRemainingSubmits = userQuota.remainingSubmits - 1;
                const newCachedPosts = [...userQuota.cachedPosts, ...generatedPosts];
                
                const { error: updateError } = await supabase
                    .from('user_quotas')
                    .update({ 
                        remaining_submits: newRemainingSubmits,
                        api_calls_today: newApiCalls,
                        cached_posts: newCachedPosts
                    })
                    .eq('user_id', currentUser.id);
                
                if (updateError) throw updateError;
                
                // Update local state
                userQuota.remainingSubmits = newRemainingSubmits;
                userQuota.apiCallsToday = newApiCalls;
                userQuota.cachedPosts = newCachedPosts;
                
                updateQuotaUI();
                
                // Show the posts to the user
                showCachedPosts(count);
            } catch (error) {
                console.error('Error generating posts:', error.message);
                alert(`Error: ${error.message}`);
            } finally {
                generateBtn.classList.remove('hidden');
                loadingBtn.classList.add('hidden');
            }
        });
        
        function showCachedPosts(count) {
            // Determine how many posts we can show based on remaining quota
            const totalAvailablePosts = userQuota.remainingPosts + userQuota.purchasedPosts;
            const postsToShow = Math.min(count, totalAvailablePosts, userQuota.cachedPosts.length);
            
            // Slice the cached posts
            const posts = userQuota.cachedPosts.slice(0, postsToShow);
            
            // Clear previous posts
            postsContainer.innerHTML = '';
            
            // Add new posts
            posts.forEach((post, index) => {
                const postElement = document.createElement('div');
                postElement.className = 'post-card bg-white p-4 rounded-lg relative';
                postElement.innerHTML = `
                    <div class="prose prose-sm max-w-none">${post}</div>
                    <button class="copy-btn absolute top-2 right-2 p-1 rounded-md hover:bg-gray-100"
                    style="background-color: var(--color-bg-primary);">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        style="color: var(--color-text-secondary);">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                    </button>
                `;
                
                postsContainer.appendChild(postElement);
                
                // Add copy functionality
                const copyBtn = postElement.querySelector('.copy-btn');
                copyBtn.addEventListener('click', () => {
                    navigator.clipboard.writeText(post);
                    
                    // Show feedback
                    const originalHTML = copyBtn.innerHTML;
                    copyBtn.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                    `;
                    
                    setTimeout(() => {
                        copyBtn.innerHTML = originalHTML;
                    }, 2000);
                });
            });
            
            // Update counts
            shownPostsCount.textContent = postsToShow;
            totalPostsCount.textContent = userQuota.cachedPosts.length;
            
            // Show results section if hidden
            resultsSection.classList.remove('hidden');
            
            // Show more posts section if they've used all their free posts
            if (userQuota.remainingPosts <= 0 && userQuota.purchasedPosts <= 0) {
                morePostsSection.classList.remove('hidden');
            } else {
                morePostsSection.classList.add('hidden');
            }
            
            // Update remaining posts in UI
            if (postsToShow > 0) {
                // Deduct from purchased posts first
                if (userQuota.purchasedPosts > 0) {
                    const deductedFromPurchased = Math.min(postsToShow, userQuota.purchasedPosts);
                    userQuota.purchasedPosts -= deductedFromPurchased;
                    
                    // Deduct remaining from free posts if needed
                    const remainingToDeduct = postsToShow - deductedFromPurchased;
                    if (remainingToDeduct > 0) {
                        userQuota.remainingPosts -= remainingToDeduct;
                    }
                } else {
                    userQuota.remainingPosts -= postsToShow;
                }
                
                // Update in database
                supabase
                    .from('user_quotas')
                    .update({ 
                        remaining_posts: userQuota.remainingPosts,
                        purchased_posts: userQuota.purchasedPosts
                    })
                    .eq('user_id', currentUser.id);
                
                updateQuotaUI();
            }
        }
        
        // Addon purchases
        addon1Btn.addEventListener('click', async () => {
            if (!currentUser) {
                alert('Please sign in to purchase addons');
                authModal.classList.remove('hidden');
                return;
            }
            
            // Check if user has already purchased max allowed (3)
            if (userQuota.purchasedPosts >= 30) {
                alert('You have reached the maximum allowed purchased posts (30). Please use a new input addon to generate more content.');
                return;
            }
            
            // Check if they have cached posts available
            if (userQuota.cachedPosts.length <= (userQuota.remainingPosts + userQuota.purchasedPosts)) {
                alert('No additional posts available from your current generation. Please submit a new description first.');
                return;
            }
            
            // Open Lemon Squeezy checkout
            LemonSqueezy.Url.Open(`https://yourstore.lemonsqueezy.com/checkout/buy/YOUR_PRODUCT_ID?checkout[custom][user_id]=${currentUser.id}&checkout[custom][addon_type]=more_posts`);
        });
        
        addon2Btn.addEventListener('click', async () => {
            if (!currentUser) {
                alert('Please sign in to purchase addons');
                authModal.classList.remove('hidden');
                return;
            }
            
            // Check API limits
            if (userQuota.apiCallsToday >= 100) {
                alert('Daily API limit reached. Please try again tomorrow.');
                return;
            }
            
            // Open Lemon Squeezy checkout
            LemonSqueezy.Url.Open(`https://yourstore.lemonsqueezy.com/checkout/buy/YOUR_PRODUCT_ID?checkout[custom][user_id]=${currentUser.id}&checkout[custom][addon_type]=new_input`);
        });
        
        // Feedback form submission
        feedbackForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = feedbackName.value.trim();
            const email = feedbackEmail.value.trim();
            const text = feedbackText.value.trim();
            
            if (!name || !text) {
                alert('Please fill in all required fields');
                return;
            }
            
            try {
                // In a real implementation, you would send this to your backend
                // For this example, we'll simulate sending an email
                const emailBody = `New feedback from PostMint AI:\n\nName: ${name}\nEmail: ${email}\nFeedback: ${text}`;
                
                // In a real app, you would use a serverless function or backend API
                // to send this to your email (khmpmethmal@gmail.com)
                console.log('Feedback submitted (would send to khmpmethmal@gmail.com):', emailBody);
                
                alert('Thank you for your feedback! We appreciate your input.');
                feedbackForm.reset();
            } catch (error) {
                console.error('Error submitting feedback:', error);
                alert('There was an error submitting your feedback. Please try again.');
            }
        });
        
        // Webhook handler for Lemon Squeezy purchases
        async function handlePurchaseWebhook(data) {
            // This would be called from your backend when Lemon Squeezy sends a webhook
            // For now, we'll simulate it with a function you can call from your backend
            
            const userId = data.custom.user_id;
            const addonType = data.custom.addon_type;
            
            try {
                // Get current quota
                const { data: quotaData, error: quotaError } = await supabase
                    .from('user_quotas')
                    .select('*')
                    .eq('user_id', userId)
                    .single();
                
                if (quotaError) throw quotaError;
                
                // Update based on addon type
                let updates = {};
                
                if (addonType === 'more_posts') {
                    // Check if user has already purchased max allowed (3)
                    if (quotaData.purchased_posts >= 30) {
                        return { success: false, error: 'Maximum purchased posts reached' };
                    }
                    
                    updates.purchased_posts = (quotaData.purchased_posts || 0) + 10;
                } else if (addonType === 'new_input') {
                    updates.purchased_submits = (quotaData.purchased_submits || 0) + 1;
                }
                
                const { error: updateError } = await supabase
                    .from('user_quotas')
                    .update(updates)
                    .eq('user_id', userId);
                
                if (updateError) throw updateError;
                
                // Reload quota if this is the current user
                if (currentUser && currentUser.id === userId) {
                    await loadUserQuota();
                }
                
                return { success: true };
            } catch (error) {
                console.error('Error processing purchase:', error.message);
                return { success: false, error: error.message };
            }
        }
        
        // Initialize
        initializeTheme();
        checkAuthState();
        
        // Listen for auth state changes
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                currentUser = session.user;
                loadUserQuota();
                updateUIAfterAuth();
            } else if (event === 'SIGNED_OUT') {
                currentUser = null;
                updateUIAfterAuth();
            }
        });
    </script>
</body>
</html>