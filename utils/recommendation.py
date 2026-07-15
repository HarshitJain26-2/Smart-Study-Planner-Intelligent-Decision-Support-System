import random

# A collection of motivational quotes
MOTIVATIONAL_QUOTES = [
    {"text": "The secret of getting ahead is getting started.", "author": "Mark Twain"},
    {"text": "It always seems impossible until it's done.", "author": "Nelson Mandela"},
    {"text": "Success is not final, failure is not fatal: it is the courage to continue that counts.", "author": "Winston Churchill"},
    {"text": "Don't let what you cannot do interfere with what you can do.", "author": "John Wooden"},
    {"text": "The only limit to our realization of tomorrow will be our doubts of today.", "author": "Franklin D. Roosevelt"},
    {"text": "Believe you can and you're halfway there.", "author": "Theodore Roosevelt"},
    {"text": "Start where you are. Use what you have. Do what you can.", "author": "Arthur Ashe"},
    {"text": "There are no secrets to success. It is the result of preparation, hard work, and learning from failure.", "author": "Colin Powell"},
    {"text": "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", "author": "Brian Herbert"},
    {"text": "You don't have to be great to start, but you have to start to be great.", "author": "Zig Ziglar"}
]

# Static study tips
STUDY_TIPS = [
    "Practice Active Recall by testing yourself instead of just re-reading text.",
    "Use the Pomodoro Technique: study for 25 minutes, then take a 5-minute break.",
    "Solve Previous Year Questions (PYQs) to understand the exam pattern and high-yield topics.",
    "Revise key formulas and brief notes daily before sleeping to improve retention.",
    "Ensure you get 7-8 hours of sleep; sleep is critical for memory consolidation.",
    "Study the most difficult or high-weightage topics first when your mind is fresh.",
    "Eliminate distractions: keep your phone in another room while studying.",
    "Teach what you learned to an imaginary student to identify gaps in your understanding."
]

def get_recommendations(level, days_left, syllabus_completed, study_hours, difficulty):
    """
    Generates personalized recommendations, a daily schedule, tips, and a motivational quote.
    """
    # 1. Actionable recommendations based on preparation level
    action_items = []
    
    # 2. Daily schedule structure
    schedule = {
        "morning": "",
        "afternoon": "",
        "evening": "",
        "night": ""
    }
    
    if level == "Excellent":
        action_items = [
            "Your preparation is outstanding! Prioritize high-quality revision over learning new content.",
            "Focus heavily on full-length mock tests under real exam conditions.",
            "Analyze mock test errors carefully to identify and fix minor slip-ups.",
            "Maintain confidence, reduce screen time, and ensure you get 8 hours of sleep daily."
        ]
        schedule["morning"] = "Review summary notes and mind maps (1.5 hours)"
        schedule["afternoon"] = "Take a full-length simulated mock exam (3 hours)"
        schedule["evening"] = "Review mock test mistakes and document weak areas (1.5 hours)"
        schedule["night"] = "Relaxation, light reading, and early sleep"
        
    elif level == "Good":
        action_items = [
            "You are in a great position. Work on completing the remaining syllabus systematically.",
            "Dedicate 60% of your study time to finishing remaining topics and 40% to active revision.",
            "Practice section-wise tests for subjects with higher difficulty.",
            "Create short bullet notes for last-minute revision."
        ]
        schedule["morning"] = "Study the remaining high-difficulty syllabus topics (2.5 hours)"
        schedule["afternoon"] = "Solve section-wise practice questions & review formulas (2 hours)"
        schedule["evening"] = "Revise topics studied in the last 3 days (1.5 hours)"
        schedule["night"] = "Quick review of today's study logs and sleep"

    elif level == "Moderate":
        action_items = [
            "Your status is moderate. You need to increase study hours immediately to cover the syllabus.",
            "Focus on high-weightage chapters first. Do not spend too much time on low-yield topics.",
            "Incorporate daily revision checkpoints so you don't forget older topics.",
            "Try to study at least 5-6 hours daily until the exam."
        ]
        schedule["morning"] = "Cover high-weightage syllabus topics (3 hours)"
        schedule["afternoon"] = "Solve solved examples and basic question banks (2 hours)"
        schedule["evening"] = "Revise core concepts and definitions (1.5 hours)"
        schedule["night"] = "Solve a small topic quiz and structure tomorrow's study plan"

    else:  # Critical
        action_items = [
            "CRITICAL STAGE! Immediately stop trying to learn completely new chapters.",
            "Focus strictly on high-yield topics, repeated questions, and key formulas.",
            "Solve Previous Year Papers (PYQs) rather than reading textbooks.",
            "Increase study time to 8+ hours per day (balanced with healthy breaks).",
            "Leverage video summaries or crash courses to speed up concept mapping."
        ]
        schedule["morning"] = "Revise high-yield topics using crash course summaries (3.5 hours)"
        schedule["afternoon"] = "Solve past exam papers with a timer (3 hours)"
        schedule["evening"] = "Memorize high-priority formulas, definitions, and cheat sheets (2 hours)"
        schedule["night"] = "Quick checklist check, light relaxation, and sleep (no late night cramming)"

    # Select a random quote
    quote = random.choice(MOTIVATIONAL_QUOTES)
    
    # Select 3 unique study tips
    selected_tips = random.sample(STUDY_TIPS, 3)

    return {
        "action_items": action_items,
        "schedule": schedule,
        "tips": selected_tips,
        "quote": quote
    }
