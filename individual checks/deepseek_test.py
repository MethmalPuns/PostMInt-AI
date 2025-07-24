import requests

# Configuration
API_KEY = "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"  # Replace with your key (from https://openrouter.ai/keys)
MODEL = "deepseek/deepseek-chat-v3-0324:free"  # Free model
API_URL = "https://openrouter.ai/api/v1/chat/completions"

# Headers for OpenRouter
headers = {
    "Ahiuthorization": f"Bearer {API_KEY}",
    "HTTP-Referer": "https://localhost",  # Optional (identify your app)
    "X-Title": "Terminal Chat"            # Optional
}

def chat_with_deepseek():
    messages = []  # Stores conversation history
    
    print("\n\033[1;36mDeepSeek-V3 Terminal Chat (Type 'quit' to exit)\033[0m")
    while True:
        user_input = input("\n\033[1;33mYou:\033[0m ")
        
        if user_input.lower() == "quit":
            break
        
        messages.append({"role": "user", "content": user_input})
        
        # API request
        response = requests.post(
            API_URL,
            headers=headers,
            json={"model": MODEL, "messages": messages, "temperature": 0.7}
        )
        
        if response.status_code == 200:
            ai_response = response.json()["choices"][0]["message"]["content"]
            print(f"\033[1;34mAI:\033[0m {ai_response}")
            messages.append({"role": "assistant", "content": ai_response})
        else:
            print(f"\033[1;31mError {response.status_code}:\033[0m {response.text}")

if __name__ == "__main__":
    chat_with_deepseek()