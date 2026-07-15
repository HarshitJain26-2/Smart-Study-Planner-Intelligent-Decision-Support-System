import datetime
from flask import Flask, render_template, request, jsonify
from utils.validators import validate_inputs
from utils.decision_engine import calculate_preparation_score, evaluate_preparation_level
from utils.recommendation import get_recommendations

app = Flask(__name__)

@app.route('/')
def home():
    """
    Renders the main dashboard page.
    """
    # Provide the current date for the dashboard header
    current_date = datetime.date.today().strftime("%B %d, %Y")
    return render_template('index.html', current_date=current_date)

@app.route('/analyze', methods=['POST'])
def analyze():
    """
    API endpoint to evaluate study planning inputs.
    Expects JSON payload with:
    - days_left: int
    - syllabus_completed: float
    - study_hours: float
    - difficulty: int
    - student_name: str (optional)
    - subject_name: str (optional)
    """
    data = request.get_json() or {}
    
    days_left = data.get('days_left')
    syllabus_completed = data.get('syllabus_completed')
    study_hours = data.get('study_hours')
    difficulty = data.get('difficulty')
    student_name = data.get('student_name', 'Student').strip() or 'Student'
    subject_name = data.get('subject_name', 'Subject').strip() or 'Subject'
    
    # 1. Run validation checks
    is_valid, errors = validate_inputs(days_left, syllabus_completed, study_hours, difficulty)
    
    if not is_valid:
        return jsonify({
            'success': False,
            'errors': errors
        }), 400

    # Convert sanitized variables to proper types
    days_left = int(days_left)
    syllabus_completed = float(syllabus_completed)
    study_hours = float(study_hours)
    difficulty = int(difficulty)

    # 2. Run decision engine to calculate scores & readiness
    score = calculate_preparation_score(days_left, syllabus_completed, study_hours, difficulty)
    level, badge_color, status_title = evaluate_preparation_level(
        days_left, syllabus_completed, study_hours, difficulty, score
    )

    # 3. Get recommendations & schedule
    recs = get_recommendations(level, days_left, syllabus_completed, study_hours, difficulty)

    # 4. Return results as JSON
    response_data = {
        'success': True,
        'student_name': student_name,
        'subject_name': subject_name,
        'inputs': {
            'days_left': days_left,
            'syllabus_completed': syllabus_completed,
            'study_hours': study_hours,
            'difficulty': difficulty
        },
        'analysis': {
            'score': score,
            'level': level,
            'badge_color': badge_color,
            'status_title': status_title,
            'readiness_percentage': score  # The overall score out of 100 acts as our study readiness percentage
        },
        'recommendation': {
            'action_items': recs['action_items'],
            'schedule': recs['schedule'],
            'tips': recs['tips'],
            'quote': recs['quote']
        }
    }

    return jsonify(response_data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
