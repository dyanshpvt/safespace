"""
Flask API server to bridge the CompanionBot with React frontend
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from datetime import datetime
from chatbot import CompanionBot

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Global bot instance
bot = CompanionBot(
    checkin_interval_seconds=60*60*4, 
    problem_phase_limit=4, 
    wrap_up_threshold=35
)

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat messages from frontend"""
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400
        
        # Process message through bot
        initial_history_length = len(bot.conversation_history)
        bot.handle_user_input(user_message)
        
        # Get the latest response
        if len(bot.conversation_history) > initial_history_length:
            latest_conversation = bot.conversation_history[-1]
            bot_response = latest_conversation.get('assistant', 'I hear you.')
            sentiment = latest_conversation.get('sentiment', {})
            stage = latest_conversation.get('stage', 'companion')
        else:
            bot_response = "I'm here to listen and support you."
            sentiment = {'polarity': 0.0, 'risk_level': 'low'}
            stage = 'companion'
        
        # Return response with metadata
        return jsonify({
            'response': bot_response,
            'sentiment': sentiment,
            'stage': stage,
            'risk_level': bot.user_profile.get('risk_level', 'low'),
            'message_count': bot.user_profile.get('message_count', 0),
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"Chat API error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/assessment', methods=['POST'])
def assessment():
    """Handle assessment requests (PHQ-9, GAD-7)"""
    try:
        data = request.get_json()
        assessment_type = data.get('type', '')  # 'phq9' or 'gad7'
        responses = data.get('responses', [])  # Array of 0-3 responses
        
        if assessment_type == 'phq9' and len(responses) == 9:
            score = sum(responses)
            result = {
                'type': 'PHQ-9',
                'score': score,
                'max_score': 27,
                'interpretation': get_phq9_interpretation(score),
                'timestamp': datetime.now().isoformat()
            }
            bot.user_profile['last_assessment'] = result
            
        elif assessment_type == 'gad7' and len(responses) == 7:
            score = sum(responses)
            result = {
                'type': 'GAD-7', 
                'score': score,
                'max_score': 21,
                'interpretation': get_gad7_interpretation(score),
                'timestamp': datetime.now().isoformat()
            }
            bot.user_profile['last_assessment'] = result
            
        else:
            return jsonify({'error': 'Invalid assessment type or responses'}), 400
            
        return jsonify(result)
        
    except Exception as e:
        print(f"Assessment API error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/escalate', methods=['POST'])
def escalate():
    """Handle escalation requests"""
    try:
        data = request.get_json()
        escalation_type = data.get('type', 'ai')  # 'ai' or 'human'
        
        if escalation_type == 'ai':
            bot.escalate_to_ai_psychologist()
            message = "Connected to AI psychologist for specialized support."
        else:
            bot.escalate_to_human()
            message = "Escalated to human support. Emergency resources provided."
            
        return jsonify({
            'message': message,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"Escalation API error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/status', methods=['GET'])
def status():
    """Get current bot status and user profile"""
    try:
        return jsonify({
            'user_profile': bot.user_profile,
            'conversation_count': len(bot.conversation_history),
            'last_assessment': bot.user_profile.get('last_assessment'),
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"Status API error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/history', methods=['GET'])
def history():
    """Get conversation history"""
    try:
        limit = request.args.get('limit', 10, type=int)
        recent_history = bot.conversation_history[-limit:] if limit > 0 else bot.conversation_history
        
        return jsonify({
            'history': recent_history,
            'total_count': len(bot.conversation_history),
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"History API error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

def get_phq9_interpretation(score):
    """Get PHQ-9 score interpretation"""
    if score >= 20:
        return {
            'level': 'severe',
            'description': 'Severe depressive symptoms. Immediate professional support recommended.',
            'action': 'urgent'
        }
    elif score >= 15:
        return {
            'level': 'moderately_severe', 
            'description': 'Moderately severe symptoms. Consider contacting a clinician.',
            'action': 'recommended'
        }
    elif score >= 10:
        return {
            'level': 'moderate',
            'description': 'Moderate symptoms. Consider monitoring and professional input.',
            'action': 'consider'
        }
    elif score >= 5:
        return {
            'level': 'mild',
            'description': 'Mild symptoms. Practice self-care and monitor.',
            'action': 'monitor'
        }
    else:
        return {
            'level': 'minimal',
            'description': 'Minimal symptoms. Continue self-care practices.',
            'action': 'maintain'
        }

def get_gad7_interpretation(score):
    """Get GAD-7 score interpretation"""
    if score >= 15:
        return {
            'level': 'severe',
            'description': 'Severe anxiety. Consider immediate professional support.',
            'action': 'urgent'
        }
    elif score >= 10:
        return {
            'level': 'moderate',
            'description': 'Moderate anxiety. Consider seeking support.',
            'action': 'recommended'
        }
    elif score >= 5:
        return {
            'level': 'mild',
            'description': 'Mild anxiety. Self-care recommended.',
            'action': 'monitor'
        }
    else:
        return {
            'level': 'minimal',
            'description': 'Minimal anxiety. Continue current practices.',
            'action': 'maintain'
        }

if __name__ == '__main__':
    print("🚀 Starting SafeSpace Chatbot API Server...")
    print("🔗 Frontend can connect to: http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
