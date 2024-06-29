from flask import Flask, jsonify, request
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import AIMessage, HumanMessage
import os

app = Flask(__name__)

api_key = os.getenv('ANTHROPIC_API_KEY')
model = ChatAnthropic(model="claude-3-opus-20240229", temperature=0, max_tokens=1024)

@app.route('/generate_diagram', methods=['POST'])
def generate_diagram():
    content = request.json.get('content', '')
    
    message = HumanMessage(content=content)
    response = model.invoke([message])

    return jsonify({
        'response': response.content
    })

if __name__ == '__main__':
    app.run(debug=True)