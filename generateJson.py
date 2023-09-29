import json

techniques_data = [
    {"section": "Basic Movements", "subSection": "Basic Movements", "techniques": ["Shoulder Walk", "Defensive Set", "Defensive Set Switch Base", "Rising Hip Escape & Sprawl", "Hip Switch", "Bridge Up", "Bridge Over Left & Right To Posture", "Bridge To Rising Hip Escape & Butt Scoot", "Back Step", "Forward Roll", "Back Roll", "Tie Belt"]},
    {"section": "Escapes", "subSection": "Back Escapes", "techniques": ["Back Escape Underhook Side", "Back Escape Overhook Side", "Back Escape Triple Threat"]},
    {"section": "Escapes", "subSection": "Mount Escapes", "techniques": ["Hip Escape", "Bridge & Roll"]},
    {"section": "Escapes", "subSection": "Side Control Escapes", "techniques": ["Arms In Shoulder Walk", "Arms Out", "Arms Out Pummel Arms In"]},
    {"section": "Escapes", "subSection": "North South Escapes", "techniques": ["Arms Out", "Arms In"]},
    {"section": "Escapes", "subSection": "Knee Ride Escapes", "techniques": ["Wrestle Up"]},
    {"section": "Escapes", "subSection": "Turtle Escapes", "techniques": ["Front Turtle Chin Strap", "Front Turtle Front Head Lock", "Front Turtle Body Lock", "Side", "Rear Turtle", "Transition Front to Rear"]},
    {"section": "Escapes", "subSection": "Headlock Escapes", "techniques": ["Body Lock", "Shoulder Control To Kimura Trap"]},
    {"section": "Back Control", "subSection": "Back Retention", "techniques": ["Riding", "Hip Switching (Left & Right)", "Reloading (Left, right goofy boat ramp, right north south)"]},
    {"section": "Back Control", "subSection": "Back Transitions", "techniques": ["To Mount", "To Side Control/Head Arm"]},
    {"section": "Back Control", "subSection": "Back Attacks", "techniques": ["Rear Naked Choke", "Kimura Trap Armbar", "Reverse Triangle"]},
    {"section": "Side Control", "subSection": "Side Control Transitions", "techniques": ["Opponent Turns Away - Seatbelt to Back", "Opponent Turns In - Top Spin to Seatbelt to Back", "Opponent Pushes - Knee Ride", "Opponent Shoulder Walks - Switch Base Top Spin", "Opponent Stays Flat - Force Mount", "Opponent Stays Flat - Force Back"]},
    {"section": "Side Control", "subSection": "Side Control Attacks", "techniques": ["Darce"]},
    {"section": "Mount", "subSection": "Mount Maintenance", "techniques": ["Lean & Swim, Hook & Base", "High Mount, Low Mount", "Stripping Grips", "Head Turning"]},
    {"section": "Mount", "subSection": "Mount Transitions", "techniques": ["Side Mount to Back", "Underhook to Back", "Knee Ride", "Side Control"]},
    {"section": "Mount", "subSection": "Mount Attacks", "techniques": ["Underhook Head Arm", "Underhook Back", "Underhook Americana"]},
    {"section": "Knee Ride", "subSection": "Knee Ride Transitions", "techniques": ["Opponent Turns Away - Seatbelt to Back", "Opponent Turns In Hip Escapes - Top Spin", "Opponent Rolls In - Windscreen Wiper to Seat Belt", "Opponent Pushes - Knee Cut to Mount"]},
    {"section": "Knee Ride", "subSection": "Knee Ride Attacks", "techniques": ["Darce"]},
    {"section": "Turtle", "subSection": "Front Turtle", "techniques": ["Transition to Rear Turtle with Cross Face", "Transition to Rear Turtle with Front Headlock", "Transition to Side Turtle"]},
    {"section": "Turtle", "subSection": "Side Turtle", "techniques": ["Transition to Rear Turtle", "Guard Recovery Counter"]},
    {"section": "Turtle", "subSection": "Rear Turtle", "techniques": ["Turtle Breakdown Backtake", "Turtle Breakdown Backtake Wide Base", "Turtle Breakdown Backtake Outside Hook", "Guard Recovery Counter"]},
    {"section": "Passing Guard", "subSection": "Closed Guard", "techniques": ["On Knees: The Muzz", "Standing: Log Splitter"]},
    {"section": "Passing Guard", "subSection": "Half Guard", "techniques": ["Bodylock"]},
    {"section": "Passing Guard", "subSection": "Passing Under", "techniques": ["Single/Double Unders"]},
    {"section": "Passing Guard", "subSection": "Passing Over", "techniques": ["Knee Cut"]},
    {"section": "Passing Guard", "subSection": "Passing Around", "techniques": ["Step Around", "Shin Trip", "Leg Drag", "Torreando"]},
    {"section": "Passing Guard", "subSection": "Passing Long Range", "techniques": ["Torreando", "Counter Gongao", "Counter Hip Switch: North South", "Counter Turtling Opponent", "Legs High", "Jamming Heels Pummel High", "Jamming Heels Pummel One Leg"]},
    {"section": "Playing Guard", "subSection": "Closed Guard", "techniques": ["Overhook Triangle", "Overhook Omoplata", "Overhook to Back"]},
    {"section": "Playing Guard", "subSection": "Reverse De La Riva", "techniques": ["Kiss of the Dragon", "Tilt Sweep", "Wrestle Up"]},
    {"section": "Playing Guard", "subSection": "Z Guard", "techniques": ["Triangle", "Wrestle Up", "Back Take"]},
    {"section": "Playing Guard", "subSection": "Guard Entries", "techniques": ["Guard Entry to Sweep or Sub"]},
    {"section": "Takedowns", "subSection": "Takedowns", "techniques": ["Single Leg", "Double Leg", "Body Lock"]}
]

techniques_list = []
techniqueId = 1
for group in techniques_data:
    for technique_name in group["techniques"]:
        techniques_list.append({
            "techniqueId": techniqueId,
            "name": technique_name,
            "section": group["section"],
            "subSection": group["subSection"],
            "videoSrc": "",
            "imageSrc": "",
            "description": "",
            "globalNotes": ""
        })
        techniqueId += 1

techniques_json = {
    "techniques": techniques_list
}

formatted_json = json.dumps(techniques_json, indent=4)

file_path = r"C:\Users\mattt\Documents\Programming\syllabustracker\data\techniques.json"
with open(file_path, 'w') as file:
    file.write(formatted_json)