from utils.validators import validate_inputs
from utils.decision_engine import calculate_preparation_score, evaluate_preparation_level
from utils.recommendation import get_recommendations

def test_validator():
    print("Running Validator Tests...")
    
    # Test valid inputs
    valid, errors = validate_inputs(10, 60, 5, 4)
    assert valid is True, f"Failed on valid inputs: {errors}"
    assert len(errors) == 0
    
    # Test invalid values
    valid, errors = validate_inputs(0, 120, -5, 6)
    assert valid is False
    assert 'days_left' in errors
    assert 'syllabus_completed' in errors
    assert 'study_hours' in errors
    assert 'difficulty' in errors
    print("OK: Validator Tests Passed!")

def test_decision_engine():
    print("Running Decision Engine Tests...")
    
    # Case 1: Excellent Profile (100% syllabus, 5 hours study, 10 days left)
    score1 = calculate_preparation_score(10, 100.0, 5.0, 3)
    level1, badge1, title1 = evaluate_preparation_level(10, 100.0, 5.0, 3, score1)
    assert level1 == "Excellent", f"Expected Excellent, got {level1}"
    print(f"OK: Case 1 (Excellent): Score={score1}, Level={level1}")

    # Case 2: Critical Profile (2 days left, 20% syllabus completed, high difficulty)
    score2 = calculate_preparation_score(2, 20.0, 3.0, 5)
    level2, badge2, title2 = evaluate_preparation_level(2, 20.0, 3.0, 5, score2)
    assert level2 == "Critical", f"Expected Critical, got {level2}"
    print(f"OK: Case 2 (Critical): Score={score2}, Level={level2}")

    # Case 3: Moderate Profile (5 days left, 60% syllabus completed, 2 hours study)
    score3 = calculate_preparation_score(5, 60.0, 2.0, 3)
    level3, badge3, title3 = evaluate_preparation_level(5, 60.0, 2.0, 3, score3)
    assert level3 == "Moderate", f"Expected Moderate, got {level3}"
    print(f"OK: Case 3 (Moderate): Score={score3}, Level={level3}")

    # Case 4: Good Profile (15 days left, 85% syllabus completed, 4 hours study)
    score4 = calculate_preparation_score(15, 85.0, 4.0, 3)
    level4, badge4, title4 = evaluate_preparation_level(15, 85.0, 4.0, 3, score4)
    assert level4 == "Good", f"Expected Good, got {level4}"
    print(f"OK: Case 4 (Good): Score={score4}, Level={level4}")
    
    print("OK: Decision Engine Tests Passed!")

def test_recommendation_engine():
    print("Running Recommendation Engine Tests...")
    recs = get_recommendations("Critical", 2, 20.0, 3.0, 5)
    assert 'action_items' in recs
    assert len(recs['action_items']) > 0
    assert 'schedule' in recs
    assert recs['schedule']['morning'] != ""
    assert 'tips' in recs
    assert len(recs['tips']) == 3
    assert 'quote' in recs
    print("OK: Recommendation Engine Tests Passed!")

if __name__ == '__main__':
    print("================================")
    print("Starting Smart Study Planner Tests")
    print("================================")
    test_validator()
    print("--------------------------------")
    test_decision_engine()
    print("--------------------------------")
    test_recommendation_engine()
    print("================================")
    print("All unit tests passed successfully!")
    print("================================")
