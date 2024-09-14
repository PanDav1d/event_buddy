from flask import Flask, json, jsonify, request
import mysql.connector
from mysql.connector import Error
from datetime import datetime
import yaml
import hashlib

app = Flask(__name__)

# there is a different version on the server running cause external files didnt worked out well
def create_connection():
    with open("config.yaml", "r") as config_file:
        config = yaml.safe_load(config_file)
    try:
        connection = mysql.connector.connect(**config['database'])
        return connection
    except Error as e:
        print(f"Error connecting to MySQL Database: {e}")
        return None


def create_saved_event_table():
    create_table_query = """
        CREATE TABLE IF NOT EXISTS saved_event (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            event_id INT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES user(id),
            FOREIGN KEY (event_id) REFERENCES event(id)
        );
    """
    try:
        connection = create_connection()
        if connection is not None:
            cursor = connection.cursor()
            cursor.execute(create_table_query)
            connection.commit()
            print("table 'saved_event' has been created.")
            cursor.close()
            connection.close()
    except Error as error:
        print("Error while creating table 'user': ", error)

def create_user_table():
    create_table_query = """
        CREATE TABLE IF NOT EXISTS user (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50),
            password VARCHAR(80),
            first_name VARCHAR(50),
            last_name VARCHAR(50),
            email VARCHAR(50),
            profile_image_url VARCHAR(100),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    """
    try:
        connection = create_connection()
        if connection is not None:
            cursor = connection.cursor()
            cursor.execute(create_table_query)
            connection.commit()
            print("table 'user' has been created.")
            cursor.close()
            connection.close()
    except Error as error:
        print("Error while creating table 'user': ", error)

def create_event_table():
    create_table_query = """
        CREATE TABLE IF NOT EXISTS event (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(50),
            organizer INT,
            description VARCHAR(250),
            image_url VARCHAR(100),
            unix_time BIGINT,
            latitude FLOAT,
            longitude FLOAT
        );
        """
    try:
        connection = create_connection()
        if connection is not None:
            cursor = connection.cursor()
            cursor.execute(create_table_query)
            connection.commit()
            print("Database 'event' has been created.")
            cursor.close()
            connection.close()
    except Error as error:
        print("Error while creating table: ", error)

def insert_user(username, password, first_name, last_name, email, profile_image_url):
    insert_query = '''
    INSERT INTO user (username, password, first_name, last_name, email, profile_image_url)
    VALUES (%s, %s, %s, %s, %s, %s);
    '''
    try:
        connection = create_connection()
        if connection is not None:
            cursor = connection.cursor()
            cursor.execute(insert_query, (username, password, first_name, last_name, email, profile_image_url))
            connection.commit()
            cursor.close()
            connection.close()
    except Error as error:
        print("Error while inserting user: ", error)

def get_user_by_username(username):
    select_query = '''
        SELECT * FROM user WHERE username = %s;
    '''
    try:
        connection = create_connection()
        if connection is not None:
            cursor = connection.cursor(dictionary=True)
            cursor.execute(select_query, (username,))
            user = cursor.fetchone()
            cursor.close()
            connection.close()
            return user
    except Error as error:
        print("Error while fetching user: ", error)
        return None

def verify_password(password, hashed_password):
    return hashlib.sha256(password.encode()).hexdigest() == hashed_password


def insert_saved_event(user_id, event_id):
    insert_query = '''
    INSERT INTO saved_event (user_id, event_id)
    VALUES (%s, %s);
    '''
    try:
        connection = create_connection()
        if connection is not None:
            cursor = connection.cursor()
            cursor.execute(insert_query, (user_id, event_id))
            connection.commit()
            cursor.close()
            connection.close()
    except Error as error:
        print("Error while inserting saved event: ", error)

def isSaved(user_id, event_id):
    query = '''
    SELECT EXISTS(SELECT 1 FROM saved_event WHERE user_id = %s AND event_id = %s);
    '''
    try:
        connection = create_connection()
        if connection is not None:
            cursor = connection.cursor()
            cursor.execute(query, (user_id, event_id))
            result = cursor.fetchone()[0]
            cursor.close()
            connection.close()
            return result
    except Error as error:
        print("Error while checking saved event: ", error)
        return False

def remove_saved_event(user_id, event_id):
    delete_query = '''
    DELETE FROM saved_event
    WHERE user_id = %s AND event_id = %s;
    '''
    try:
        connection = create_connection()
        if connection is not None:
            cursor = connection.cursor()
            cursor.execute(delete_query, (user_id, event_id))
            connection.commit()
            cursor.close()
            connection.close()
    except Error as error:
        print("Error while deleting saved event: ", error)

def insert_event(title, organizer, description, image_url, unix_time, latitude, longitude):
    insert_query = '''
    INSERT INTO event (title, organizer, description, image_url, unix_time, latitude, longitude) 
    VALUES (%s, %s, %s, %s, %s, %s, %s);
    '''
    try:
        connection = create_connection()
        if connection is not None:
            cursor = connection.cursor()
            cursor.execute(insert_query, (title, organizer, description, image_url, unix_time, latitude, longitude))
            connection.commit()
            cursor.close()
            connection.close()
    except Error as error:
        print("Error while inserting event: ", error)

def insert_examples():
    events = [
        ("Oktoberfest Opening Ceremony", 1, "Experience the grand opening of the world-famous Oktoberfest, with the traditional tapping of the first keg and a parade of Bavarian culture.", "https://picsum.photos/id/237/200/300", 1723064669, 48.1351, 11.5820),  # September 16, 2024 in Munich
        ("Cologne Lights Festival", 2, "Witness a magical spectacle of light installations, fireworks, and illuminated boats along the Rhine River.", "https://picsum.photos/id/342/200/300", 1723403069, 51.4556, 7.0116),   # August 17, 2024 in Cologne
        ("Berlin Marathon", 3, "Cheer on thousands of runners from around the world in one of the most iconic marathons, passing by Berlin's landmarks.", "https://picsum.photos/id/3/200/300", 1724007869, 52.5200, 13.4050),  # September 9, 2024 in Berlin
        ("Hamburg Harbour Birthday", 4, "Celebrate the anniversary of Hamburg's harbor with ship parades, live music, and a spectacular fireworks display.", "https://picsum.photos/id/32/200/300", 1724353469, 53.5511, 9.9937),   # August 20, 2024 in Hamburg
        ("Frankfurt Book Fair", 5, "Explore the world's largest trade fair for books and publications, with author readings, discussions, and presentations.", "https://picsum.photos/id/237/200/300", 1724353469, 50.1109, 8.6821),   # October 22, 2024 in Frankfurt
        ("Oktoberfest Beer Tents", 6, "Experience the lively atmosphere of the Oktoberfest beer tents, with traditional music, food, and of course, beer.", "https://picsum.photos/id/237/200/300", 1724353469, 48.1351, 11.5820),  # October 6, 2024 in Munich
        ("Rhine Valley Fireworks Display", 7, "Enjoy a dazzling fireworks display over the picturesque Rhine Valley, illuminating the castles and vineyards.", "https://picsum.photos/id/237/200/300", 1724353469, 50.3618, 7.5562),   # August 26, 2024 in Rhine Valley
        ("Berlin Fashion Week", 8, "Discover the latest trends in fashion at Berlin Fashion Week, with runway shows, presentations, and events.", "https://picsum.photos/id/237/200/300", 1724353469, 52.5200, 13.4050),  # September 16, 2024 in Berlin
        ("Hamburg Cruise Days", 9, "Witness a spectacular parade of cruise ships in Hamburg's harbor, accompanied by music, light shows, and fireworks.", "https://picsum.photos/id/237/200/300", 1724353469, 53.5511, 9.9937),   # September 23, 2024 in Hamburg
        ("Frankfurt Museum Embankment Festival", 10, "Experience a cultural festival along Frankfurt's museum embankment, with music, art, and culinary delights.", "https://picsum.photos/id/237/200/300", 1724353469, 50.1109, 8.6821),   # September 30, 2024 in Frankfurt
        ("Oktoberfest Costume and Riflemen's Parade", 11, "Admire the traditional costumes and marching bands in the Oktoberfest Costume and Riflemen's Parade.", "https://picsum.photos/id/237/200/300", 1724353469, 48.1351, 11.5820),  # September 24, 2024 in Munich
        ("Cologne Carnival", 12, "Join the vibrant Cologne Carnival celebrations, with parades, costumes, and street parties.", "https://picsum.photos/id/237/200/300", 1724353469, 51.4556, 7.0116),   # February 11, 2025 in Cologne
        ("Berlin International Film Festival", 13, "Attend screenings and events at the prestigious Berlin International Film Festival, showcasing international cinema.", "https://picsum.photos/id/237/200/300", 1724353469, 52.5200, 13.4050),  # February 11, 2025 in Berlin
        ("Hamburg Dom", 14, "Experience Hamburg's largest funfair, with thrilling rides, games, and traditional treats.", "https://picsum.photos/id/237/200/300", 1724353469, 53.5511, 9.9937),   # February 18, 2025 in Hamburg
        ("Frankfurt Christmas Market", 15, "Get into the holiday spirit at Frankfurt's enchanting Christmas market, with festive decorations, food, and gifts.", "https://picsum.photos/id/237/200/300", 1724353469, 50.1109, 8.6821),   # December 2, 2024 in Frankfurt
        ("Oktoberfest Closing Ceremony", 16, "Witness the closing ceremony of Oktoberfest, with a final fireworks display and a farewell to the festivities.", "https://picsum.photos/id/237/200/300", 1724353469, 48.1351, 11.5820),  # October 20, 2024 in Munich
        ("Rhine in Flames", 17, "Marvel at a series of spectacular fireworks displays along the Rhine River, illuminating the castles and vineyards.", "https://picsum.photos/id/237/200/300", 1724353469, 50.3618, 7.5562),   # September 1, 2024 in Rhine Valley
        ("Berlin Art Week", 18, "Explore contemporary art at Berlin Art Week, with exhibitions, gallery openings, and special events.", "https://picsum.photos/id/237/200/300", 1724353469, 52.5200, 13.4050),  # September 18, 2024 in Berlin
        ("Hamburg Port Anniversary", 19, "Celebrate the anniversary of Hamburg's port with a maritime festival, featuring ship parades, music, and cultural events.", "https://picsum.photos/id/237/200/300", 1724353469, 53.5511, 9.9937),   # October 7, 2024 in Hamburg
        ("Frankfurt Book Fair", 20, "Explore the world's largest trade fair for books and publications, with author readings, discussions, and presentations.", "https://picsum.photos/id/237/200/300", 1724353469, 50.1109, 8.6821),   # October 22, 2024 in Frankfurt
    ]
    for event in events:
        insert_event(*event)

def get_event(event_id):
    select_query = '''
    SELECT * FROM event WHERE id = %s
    '''
    try:
        connection = create_connection()
        if connection is not None:
            cursor = connection.cursor(dictionary=True)
            cursor.execute(select_query, (event_id,))
            event = cursor.fetchone()
            cursor.close()
            connection.close()
            return event
    except Error as error:
        print("Error while fetching event: ", error)
        return None

def get_any_events():
    select_query = '''
    SELECT * FROM event
    '''
    try:
        connection = create_connection()
        if connection is not None:
            cursor = connection.cursor(dictionary=True)
            cursor.execute(select_query)
            events = cursor.fetchall()
            cursor.close()
            connection.close()
            return events
    except Error as error:
        print("Error while fetching events: ", error)
        return []

def get_events(user_id, latitude, longitude, radius, start_date, end_date):
    select_query = """
    SELECT e.*, (
        6371 * acos(
            cos(radians(%s)) * cos(radians(e.latitude)) * cos(radians(e.longitude) - radians(%s)) +
            sin(radians(%s)) * sin(radians(e.latitude))
        )
    ) AS distance,
    CASE WHEN se.event_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_saved,
    COUNT(se.event_id) AS amount_saved
    FROM event e
    LEFT JOIN saved_event se ON e.id = se.event_id AND se.user_id = %s
    WHERE e.unix_time >= %s AND e.unix_time <= %s
    GROUP BY e.id
    HAVING distance <= %s
    ORDER BY e.unix_time;
    """
    try:
        connection = create_connection()
        if connection is not None:
            cursor = connection.cursor(dictionary=True)
            cursor.execute(select_query, (latitude, longitude, latitude, user_id, int(start_date), int(end_date), radius))
            events = cursor.fetchall()
            cursor.close()
            connection.close()
            return events
    except Error as error:
        print("Error while fetching events: ", error)
        return []

def get_user(user_id):
    select_query = '''
    SELECT * FROM user WHERE id = %s
    '''
    try:
        connection = create_connection()
        if connection is not None:
            cursor = connection.cursor(dictionary=True)
            cursor.execute(select_query, (user_id,))
            user = cursor.fetchone()
            cursor.close()
            connection.close()
            return user
    except Error as error:
        print("Error while fetching user: ", error)
        return None

def get_saved_events(user_id):
    select_query = '''
    SELECT se.*, e.*,
    CASE WHEN se.event_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_saved,
    COUNT(se.event_id) AS amount_saved
    FROM saved_event se
    JOIN event e ON se.event_id = e.id
    WHERE se.user_id = %s
    GROUP BY e.id
    '''
    try:
        connection = create_connection()
        if connection is not None:
            cursor = connection.cursor(dictionary=True)
            cursor.execute(select_query, (user_id,))
            events = cursor.fetchall()
            cursor.close()
            connection.close()
            return events
    except Error as error:
        print("Error while fetching saved events: ", error)
        return []

def search_events(text):
    select_query = '''
    SELECT id, title FROM event WHERE title LIKE %s
    '''
    try:
        connection = create_connection()
        if connection is not None:
            cursor = connection.cursor(dictionary=True)
            cursor.execute(select_query, ('%' + text + '%',))
            events = cursor.fetchall()
            cursor.close
            connection.close()
            return events
    except Error as error:
        print("Error while fetching events: ", error)
        return []




@app.route("/")
def index():
    return "<p>EventBuddy API</p>"

@app.route("/api/v1/home.json", methods=['GET'])
def get_home():
    events = get_any_events()
    return jsonify(events)

@app.route("/api/v1/health", methods=['GET'])
def health():
    return jsonify("OK")

@app.route("/api/v1/register", methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    if not username or not password or not email:
        return jsonify({"error": "Missing parameters"}), 400
    if get_user_by_username(username):
        return jsonify({"error": "Username already exists"}), 400
    hashed_password = hashlib.sha256(password.encode()).hexdigest()

    user_id = insert_user(username, hashed_password, None, None, email, None)

    if user_id:
        return jsonify({"message": "User registered successfully", "user_id": user_id}), 201
    return jsonify({"error": "Failed to register user"}), 500

@app.route("/api/v1/login", methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    print(f"Login attempt for username: {username}")

    if not username or not password:
        print("Missing username or password")
        return jsonify({"error": "Missing parameters"}), 400

    print("Fetching user from database")
    user = get_user_by_username(username)

    if user:
        print(f"User found: {user}")
        if verify_password(password, user['password']):
            print("Password verified successfully")
            return jsonify({"message": "Login successful", "user_id": user['id']}), 200
        else:
            print("Password verification failed")
    else:
        print("User not found")

    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/v1/events.json/<int:user_id>', methods=['GET'])
def get_entries(user_id):
    try:
        latitude = request.args.get('latitude')
        longitude = request.args.get('longitude')
        radius = request.args.get('radius')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')

        if not latitude or not longitude or not radius or not start_date or not end_date:
            return jsonify({"error": "Missing parameters"}), 400

        print(f"User: {user_id}, Latitude: {latitude}, Longitude: {longitude}, Radius: {radius}, Start Date: {start_date}, End Date: {end_date}")

        data = get_events(user_id, latitude, longitude, radius, start_date, end_date)
        return jsonify(data), 200
    
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/event.json', methods=['POST'])
def create_event():
    try:
        data = request.json
        title = data.get('title')
        organizer = data.get('organizer')
        description = data.get('description')
        image_url = data.get('image_url')
        unix_time = data.get('unix_time')
        latitude = data.get('latitude')
        longitude = data.get('longitude')

        insert_event(title, organizer, description, image_url, unix_time, latitude, longitude)
        return jsonify({"message": "Event created successfully"}), 201

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/event.json/<int:id>', methods=['GET'])
def api_get_event(id):
    try:
        event = get_event(id)
        if event is None:
            return jsonify({"error": "Event not found"}), 404
        return jsonify(event), 200
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/profile.json/<int:id>', methods=['GET'])
def api_get_user(id):
    try:
        user = get_user(id)
        if user is None:
            return jsonify({"error": "User not found"}), 404
        return jsonify(user), 200
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/saved_events.json/<int:user_id>', methods=['GET'])
def api_get_saved_events(user_id):
    try:
        events = get_saved_events(user_id)
        if events is None:
            return jsonify({"error": "User not found"}), 404
        return jsonify(events), 200
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/saved_events.json/<int:user_id>/<int:event_id>', methods=['POST'])
def api_set_saved_event(user_id, event_id):
    try:
        if isSaved(user_id, event_id):
            remove_saved_event(user_id, event_id)
            return jsonify({"message": "Event removed from saved events"}), 200
        else:
            insert_saved_event(user_id, event_id)
            return jsonify({"message": "Event added to saved events"}), 201
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/search', methods=['POST'])
def api_search():
    try:
        data = request.json
        text = data.get('text')

        results = search_events(text)
        return jsonify(results), 200
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500



create_event_table()
create_user_table()
create_saved_event_table()

print("running")