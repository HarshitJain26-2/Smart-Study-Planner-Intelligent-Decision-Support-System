def validate_inputs(days_left, syllabus_completed, study_hours, difficulty):
    """
    Validates user inputs for the Smart Study Planner.
    Returns:
        tuple: (is_valid, error_messages)
        - is_valid (bool): True if all inputs are valid, False otherwise.
        - error_messages (dict): A dictionary mapping input keys to error message strings.
    """
    errors = {}
    
    # 1. Validate Days Left Before Exam
    try:
        days = int(days_left)
        if not (1 <= days <= 365):
            errors['days_left'] = "Days left must be between 1 and 365 days."
    except (ValueError, TypeError):
        errors['days_left'] = "Days left must be a valid integer."

    # 2. Validate Syllabus Completed %
    try:
        # Convert to float to allow partial percentages
        syllabus = float(syllabus_completed)
        if not (0.0 <= syllabus <= 100.0):
            errors['syllabus_completed'] = "Syllabus completed must be between 0% and 100%."
    except (ValueError, TypeError):
        errors['syllabus_completed'] = "Syllabus completed must be a valid percentage (0-100)."

    # 3. Validate Study Hours Per Day
    try:
        hours = float(study_hours)
        if not (0.0 <= hours <= 24.0):
            errors['study_hours'] = "Study hours must be between 0 and 24 hours per day."
    except (ValueError, TypeError):
        errors['study_hours'] = "Study hours must be a valid number of hours (0-24)."

    # 4. Validate Subject Difficulty (1-5 scale)
    try:
        diff = int(difficulty)
        if not (1 <= diff <= 5):
            errors['difficulty'] = "Difficulty must be an integer on a scale of 1 to 5."
    except (ValueError, TypeError):
        errors['difficulty'] = "Difficulty must be a valid scale integer (1-5)."

    return len(errors) == 0, errors
