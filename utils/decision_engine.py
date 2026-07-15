def calculate_preparation_score(days_left, syllabus_completed, study_hours, difficulty):
    """
    Calculates a preparation score out of 100 based on four parameters:
    - Syllabus Completed (50 Marks)
    - Study Hours Available (20 Marks)
    - Subject Difficulty (10 Marks)
    - Time Left vs Syllabus Left (20 Marks)
    """
    # 1. Syllabus Score (Max 50)
    syllabus_score = 0.5 * syllabus_completed

    # 2. Study Hours Score (Max 20)
    # Capped at 8 hours per day for maximum contribution
    study_hours_score = 20.0 * (min(study_hours, 8.0) / 8.0)

    # 3. Subject Difficulty Readiness Score (Max 10)
    # High difficulty reduces initial readiness if syllabus is incomplete.
    # If syllabus is 100%, difficulty does not drag down the readiness score.
    syllabus_ratio = syllabus_completed / 100.0
    difficulty_penalty = ((difficulty - 1) / 4.0) * (1.0 - syllabus_ratio)
    difficulty_score = 10.0 * (1.0 - difficulty_penalty)

    # 4. Time Left vs Syllabus Left Score (Max 20)
    # If student has more than 14 days, they get full marks for time.
    if days_left >= 14:
        time_score = 20.0
    else:
        # Calculate study hours needed to complete remaining syllabus
        # Heuristic: 0.1 hours per 1% syllabus per difficulty unit
        # Example: 50% syllabus left at difficulty 4 needs 50 * 4 * 0.1 = 20 hours
        remaining_syllabus = 100.0 - syllabus_completed
        hours_needed = remaining_syllabus * difficulty * 0.1
        
        # Hours available before exam
        hours_available = days_left * study_hours
        
        if hours_needed <= 0:
            time_score = 20.0
        elif hours_available >= hours_needed:
            time_score = 20.0
        else:
            # Score is proportional to available hours vs needed hours
            time_score = 20.0 * (hours_available / hours_needed)

    total_score = syllabus_score + study_hours_score + difficulty_score + time_score
    return round(total_score, 1)


def evaluate_preparation_level(days_left, syllabus_completed, study_hours, difficulty, score):
    """
    Determines the preparation level using nested and sequential if-elif-else statements.
    Returns:
        tuple: (level, badge_color, title)
        - level (str): 'Critical', 'Moderate', 'Good', 'Excellent'
        - badge_color (str): 'danger', 'warning', 'info', 'success'
        - title (str): Short description of the status
    """
    # Rule 1: Excellent Preparation
    # Reaching 100% syllabus with decent study hours, or very high syllabus completed with plenty of days left
    if syllabus_completed >= 95.0 and study_hours >= 4.0:
        level = "Excellent"
        badge_color = "success"
        title = "Fully Prepared"
        
    # Rule 2: Critical Preparation
    # Exam is extremely close (<= 3 days) and syllabus is less than half completed,
    # OR exam is in 2 days and syllabus is not mostly completed, OR the overall score is extremely low.
    elif (days_left <= 3 and syllabus_completed < 50.0) or (days_left <= 2 and syllabus_completed < 70.0) or (score < 35.0):
        level = "Critical"
        badge_color = "danger"
        title = "Urgent Action Required"
        
    # Rule 3: Good Preparation
    # High syllabus completion with adequate days left, or high score indicating strong preparedness.
    elif (syllabus_completed >= 80.0 and days_left > 7) or (score >= 70.0):
        level = "Good"
        badge_color = "success-light"  # Green/Cyan theme
        title = "On Track"
        
    # Rule 4: Moderate Preparation
    # Days left between 4-7, syllabus between 50-75%, and study hours are low.
    # OR any student with intermediate score ranges.
    elif (4 <= days_left <= 7 and 50.0 <= syllabus_completed <= 75.0 and study_hours < 4.0) or (35.0 <= score < 70.0):
        level = "Moderate"
        badge_color = "warning"
        title = "Needs Improvement"
        
    # Fallback Rule: Catch-all logic to default to Moderate if boundaries are missed
    else:
        level = "Moderate"
        badge_color = "warning"
        title = "Needs Improvement"

    return level, badge_color, title
