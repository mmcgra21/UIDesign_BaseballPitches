from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
import random
from pprint import pprint
app = Flask(__name__)

modules = [
    {
        "id":"1",
        "title":"Flashcards (easy)",
        "description":"Easy flashcard style slide deck of diagrams to get an understanding of the fundamentals.",
        "started":False,
        "completed":False
    },
    {
        "id":"2",
        "title":"Minigame",
        "description":"We then have a drag-and-drop minigame for you to practice the fundamentals learned in 1.",
        "started":False,
        "completed":False
    },
    {
        "id":"3",
        "title":"Quiz (easy)",
        "description":"Then after that, you will take our easy quiz which will test your knowledge of what you learned in 1.",
        "started":False,
        "completed":False
    },
    {
        "id":"4",
        "title":"Flashcards (hard)",
        "description":"Once you have the fundamentals down, we have a more difficult flashcard deck where you will practice distinguishing pitches in actual in-game MLB clips.",
        "started":False,
        "completed":False
    },
    {
        "id":"5",
        "title":"Quiz (hard)",
        "description":"Finally there is the final quiz to test whether you can distinguish in-game MLB pitches.",
        "started":False,
        "completed":False
    }
]

studyGuideFlag = False

pitches = [
    {
        "id":"1",
        "name":"Fastball",
        "flashcard_easy_completed":False,
        "flashcard_hard_completed":False,
        "speed_id":"Fast",
        "speed_desc":"Fast (90-100 mph)",
        "movement_desc":"None"
    },
    {
        "id":"2",
        "name":"Changeup",
        "flashcard_easy_completed":False,
        "flashcard_hard_completed":False,
        "speed_id":"Slow",
        "speed_desc":"Slow (70-80 mph)",
        "movement_desc":"None"
    },
    {
        "id":"3",
        "name":"Curveball",
        "flashcard_easy_completed":False,
        "flashcard_hard_completed":False,
        "speed_id":"Slow",
        "speed_desc":"Slow (70-80 mph)",
        "movement_desc":"Down"
    },
    {
        "id":"4",
        "name":"Slider",
        "flashcard_easy_completed":False,
        "flashcard_hard_completed":False,
        "speed_id":"Medium",
        "speed_desc":"Medium (80-90 mph)",
        "movement_desc":"Left"
    },
    {
        "id":"5",
        "name":"Slurve",
        "flashcard_easy_completed":False,
        "flashcard_hard_completed":False,
        "speed_id":"Slow",
        "speed_desc":"Slow (70-80 mph)",
        "movement_desc":"Down/Left"
    },
    {
        "id":"6",
        "name":"Screwball",
        "flashcard_easy_completed":False,
        "flashcard_hard_completed":False,
        "speed_id":"Slow",
        "speed_desc":"Slow (70-80 mph)",
        "movement_desc":"Down/Right"
    }
]

easy_quiz = {
                "placeholders": [], # placeholders pitchIx order
                "flashcards":   [] # flashcards original pitchIx order
                # "assignments":  [0,0,0,0,0,0] # pitchIx of flashcard at each placeholder
            }
hard_quiz = {
                "placeholders": [], # placeholders pitchIx order
                "flashcards":   [], # flashcards original pitchIx order
                "assignments":  [0,0,0,0,0,0] # pitchIx of flashcard at each placeholder
            }

minigame = {
    "order":     [], # Order of pitches
    "idx":       0   # currentIdx
}

# ROUTES

@app.route('/')
def home():
   return render_template('home.html',modules=modules,pitches=pitches,studyGuideFlag=studyGuideFlag)

@app.route('/module-<int:moduleId>')
def module(moduleId):
    return render_template('module-'+str(moduleId)+'.html',modules=modules,pitches=pitches,moduleId=moduleId)

@app.route('/flashcard-easy-<int:pitchId>-<string:callback>')
def flashcard_easy(pitchId,callback):
    return render_template('flashcard-easy.html',modules=modules,pitches=pitches,pitchId=pitchId,callback=callback)

@app.route('/flashcard-hard-<int:pitchId>')
def flashcard_hard(pitchId):
    return render_template('flashcard-hard.html',modules=modules,pitches=pitches,pitchId=pitchId)

@app.route('/study-guide')
def study_guide():
    return render_template('study-guide.html',modules=modules,pitches=pitches,studyGuideFlag=studyGuideFlag)

@app.route('/module-<int:moduleId>-quiz')
def module_quiz(moduleId):
    global easy_quiz
    global hard_quiz
    if moduleId == 3:
        return render_template('module-'+str(moduleId)+'-quiz.html',modules=modules,pitches=pitches,moduleId=moduleId,quiz=easy_quiz)
    else:
        return render_template('module-'+str(moduleId)+'-quiz.html',modules=modules,pitches=pitches,moduleId=moduleId,quiz=hard_quiz)

@app.route('/module-<int:moduleId>-minigame')
def module_minigame(moduleId):
    global minigame
    return render_template('module-'+str(moduleId)+'-minigame.html',modules=modules,pitches=pitches,moduleId=moduleId,game=minigame)

# ajax for updating one of the global variables
@app.route('/update', methods=['GET', 'POST'])
def update():
    global modules
    global pitches
    global studyGuideFlag

    req = request.get_json()

    # Update specified field of specified variable with specified value
    if req["variable"] == "modules":
        modules[req["id"]-1][req["field"]] = req["value"]
    elif req["variable"] == "pitches":
        pitches[req["id"]-1][req["field"]] = req["value"]
    else:
        studyGuideFlag = req["value"]

    # Send back the updated data
    return jsonify(modules=modules,pitches=pitches,studyGuideFlag=studyGuideFlag)

# ajax for restarting tutorial
@app.route('/restart-tutorial', methods=['GET', 'POST'])
def restart():
    global modules
    global pitches
    global studyGuideFlag
    global easy_quiz
    global hard_quiz
    global minigame

    # Reset modules, walk through modules and reset started and completed flags
    for module in modules:
        module["started"] = False
        module["completed"] = False
    # Reset pitches, walk through pitches and reset flashcard completed flags
    for pitch in pitches:
        pitch["flashcard_easy_completed"] = False
        pitch["flashcard_hard_completed"] = False
    # Reset studyGuideFlag to false
    studyGuideFlag = False

    # Reset quiz data
    easy_quiz = {
                    "placeholders": [],
                    "flashcards":   []
                    # "assignments":  [-1]*6
                }
    hard_quiz = {
                    "placeholders": [],
                    "flashcards":   []
                    # "assignments":  [-1]*6
                }
    
    # Reset minigame data
    minigame = {
        "order":     [],
        "idx":       0
    }
    
    # Send back the updated data
    return jsonify(modules=modules,pitches=pitches,studyGuideFlag=studyGuideFlag)

# ajax for initializing a quiz
@app.route('/initialize_quiz', methods=['GET', 'POST'])
def initialize_quiz():
    global modules
    global pitches
    global easy_quiz
    global hard_quiz
    
    req = request.get_json()

    # Figure out which quiz to update
    if req["moduleId"] == 3:
        # Initialize
        easy_quiz = {
                "placeholders": list(range(len(pitches))),
                "flashcards":   list(range(len(pitches)))
                # "assignments":  [-1]*6
            }
        # Randomize order
        random.shuffle(easy_quiz["placeholders"])
        random.shuffle(easy_quiz["flashcards"])

        # Send back the updated data
        return jsonify(modules=modules,pitches=pitches,quiz=easy_quiz)
    else:
        quiz = hard_quiz
        # Initialize
        hard_quiz = {
                "placeholders": list(range(len(pitches))),
                "flashcards":   list(range(len(pitches)))
                # "assignments":  [-1]*6
            }
        # Randomize order
        random.shuffle(hard_quiz["placeholders"])
        random.shuffle(hard_quiz["flashcards"])

        # Send back the updated data
        return jsonify(modules=modules,pitches=pitches,quiz=hard_quiz)

# @app.route('/assign', methods=['GET', 'POST'])
# def assign():
#     global modules
#     global pitches
#     global easy_quiz
#     global hard_quiz

#     req = request.get_json()

#     # Figure out which quiz to update
#     if req["moduleId"] == 3:
#         quiz = easy_quiz
#     else:
#         quiz = hard_quiz

#     quiz["assignments"][req["placeholderIx"]] = req["flashcardIx"]

#     # Send back the updated data
#     return jsonify(modules=modules,pitches=pitches,quiz=quiz)

# ajax for initializing a minigame
@app.route('/initialize_minigame', methods=['GET', 'POST'])
def initialize_minigame():
    global modules
    global pitches
    global minigame
    
    # Initialize
    minigame = {
        "order":     list(range(len(pitches))),
        "idx":       0
    }
    random.shuffle(minigame["order"])

    # Send back the updated data
    return jsonify(modules=modules,pitches=pitches,game=minigame)

@app.route('/update_minigame', methods=['GET', 'POST'])
def update_minigame():
    global modules
    global pitches
    global minigame

    # Update counter
    minigame["idx"] += 1

    # Send back the updated data
    return jsonify(modules=modules,pitches=pitches,game=minigame)

if __name__ == '__main__':
   app.run(debug = True)
