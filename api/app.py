from flask import Flask, json, jsonify, request
from flask_jwt_extended import JWTManager, create_refresh_token, jwt_required, create_access_token, get_jwt_identity
import mysql.connector
from mysql.connector import Error
from datetime import datetime, timedelta
import yaml
import hashlib

app = Flask(__name__)

jwt_secret_key = "my_secret_key"
app.config['JWT_SECRET_KEY'] = jwt_secret_key
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=14)
jwt = JWTManager(app)

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

def create_event_statistics_table():
    create_table_query = """
        CREATE TABLE IF NOT EXISTS event_statistics (
            id INT AUTO_INCREMENT PRIMARY KEY,
            event_id INT,
            actual_attendance INT,
            popularity_score FLOAT,
            engagement_rate FLOAT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (event_id) REFERENCES event(id)
        );
    """
    try:
        connection = create_connection()
        if connection is not None:
            cursor = connection.cursor()
            cursor.execute(create_table_query)
            connection.commit()
            print("table 'event_statistics' has been created.")
            cursor.close()
            connection.close()
    except Error as error:
        print("Error while creating table 'event_statistics': ", error)

def create_organizer_table():
    create_table_query = """
        CREATE TABLE IF NOT EXISTS organizer (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(50),
            description VARCHAR(150),
            verified BOOLEAN DEFAULT FALSE,
            profile_image_url VARCHAR(255),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    """
    try:
        connection = create_connection()
        if connection is not None:
            cursor = connection.cursor()
            cursor.execute(create_table_query)
            connection.commit()
            print("table 'organizer' has been created.")
            cursor.close()
            connection.close()
    except Error as error:
        print("Error while creating table 'organizer': ", error)

def create_user_table():
    create_table_query = """
        CREATE TABLE IF NOT EXISTS user (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50),
            password VARCHAR(80),
            first_name VARCHAR(50),
            last_name VARCHAR(50),
            email VARCHAR(50),
            profile_image_url VARCHAR(255),
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

def create_user_settings_table():
    create_table_query = """
        CREATE TABLE IF NOT EXISTS usersettings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            selected_categories JSON,
            latitude FLOAT,
            longitude FLOAT,
            radius INT,
            include_international BOOLEAN DEFAULT FALSE,
            notifications_enabled BOOLEAN DEFAULT TRUE,
            preferred_languages JSON,
            preferred_event_size INT,
            price_range INT,
            preferred_times TEXT,
            accessibility_needs BOOLEAN DEFAULT FALSE,
            age_preference INT,
            transport_preference INT,
            indoor_outdoor_preference INT,
            social_preference INT,
            mood_preference INT,
            weather_preference TEXT,
            spontaneity_level INT,
            interactivity_preference INT,
            crowding_preference INT,
            novelty_preference INT,
            skill_level_preference INT,
            FOREIGN KEY (user_id) REFERENCES user(id)
        );
    """
    try:
        connection = create_connection()
        if connection is not None:
            cursor = connection.cursor()
            cursor.execute(create_table_query)
            connection.commit()
            print("table 'user_settings' has been created.")
            cursor.close()
            connection.close()
    except Error as error:
        print("Error while creating table 'user_settings': ", error)

def create_event_table():
    create_table_query = """
        CREATE TABLE IF NOT EXISTS event (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(50),
            description VARCHAR(250),
            image_url VARCHAR(100),
            latitude FLOAT,
            longitude FLOAT,
            organizer_id INT,
            start_time BIGINT,
            end_time BIGINT,
            price_structure JSON,
            category INT,
            language JSON,
            event_size INT,
            accessibility_features JSON,
            age_restriction INT,
            indoor_outdoor INT,
            interactivity_level INT,
            expected_crowd_size INT,
            novelty_factor INT,
            skill_level_required INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (organizer_id) REFERENCES organizer(id)
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

def create_category_table():
    create_table_query = """
        CREATE TABLE IF NOT EXISTS category (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(50) UNIQUE,
                description VARCHAR(150),
                order_index INT
            );
    """
    try:
        connection = create_connection()
        if connection is not None:
            cursor = connection.cursor()
            cursor.execute(create_table_query)
            connection.commit()
            print("Database 'category' has been created.")
            cursor.close()
            connection.close()
    except Error as error:
        print("Error while creating table: ", error)

def create_event_category_table():
    create_table_query = """
        CREATE TABLE IF NOT EXISTS event_category (
            id INT AUTO_INCREMENT PRIMARY KEY,
            event_id INT,
            category_id INT,
            FOREIGN KEY (event_id) REFERENCES event(id),
            FOREIGN KEY (category_id) REFERENCES category(id)
        );
    """
    try:
        connection = create_connection()
        if connection is not None:
            cursor = connection.cursor()
            cursor.execute(create_table_query)
            connection.commit()
            print("Database 'event_category' has been created.")
            cursor.close()
            connection.close()
    except Error as error:
        print("Error while creating table: ", error)

def insert_category(name, description):
    insert_query = """
        INSERT INTO category (name, description) VALUES (%s, %s);
    """
    try:
        connection = create_connection()
        if connection is not None:
            cursor = connection.cursor()
            cursor.execute(insert_query, (name, description))
            connection.commit()
            cursor.close()
            connection.close()
    except Error as error:
        print("Error while inserting category: ", error)
    
def get_all_categories():
    select_query = """
        SELECT * FROM category ORDER BY order_index ASC;
    """
    try:
        connection = create_connection()
        if connection is not None:
            cursor = connection.cursor()
            cursor.execute(select_query)
            categories = cursor.fetchall()
            cursor.close()
            connection.close()
            return categories
    except Error as error:
        print("Error while fetching categories: ", error)

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

def insert_user_settings(user_id, latitude, longitude, radius, include_international, notifications_enabled, preferred_languages, preferred_event_size, price_range, preferred_times, accessibility_needs, age_preference, transport_preference, indoor_outdoor_preference, interactivity_preference, novelty_preference, skill_level_preference, crowding_preference, mood_preference, social_preference):
    insert_query = '''
    INSERT INTO usersettings (user_id, latitude, longitude, radius, include_international, notifications_enabled, preferred_languages, preferred_event_size, price_range, preferred_times, accessibility_needs, age_preference, transport_preference, indoor_outdoor_preference, interactivity_preference, novelty_preference, skill_level_preference, crowding_preference, mood_preference, social_preference)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
    '''
    try:
        connection = create_connection()
        if connection is not None:
            cursor = connection.cursor()

            # Benutze json.dumps() für JSON-Daten
            cursor.execute(insert_query, (
                user_id,
                latitude,
                longitude,
                radius,
                include_international,
                notifications_enabled,
                json.dumps(preferred_languages),  # JSON für preferred_languages
                preferred_event_size,
                price_range,
                json.dumps(preferred_times),  # JSON für preferred_times, falls mehrere Zeiten
                accessibility_needs,
                age_preference,
                transport_preference,
                indoor_outdoor_preference,
                interactivity_preference,
                novelty_preference,
                skill_level_preference,
                crowding_preference,
                mood_preference,
                social_preference
            ))
            connection.commit()
            cursor.close()
            connection.close()
    except Error as error:
        print("Error while inserting user settings: ", error)

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

def insert_event(title, organizer_id, description, image_url, start_time, end_time, latitude, longitude, price_structure, category, language, event_size, accessibility_features, age_restriction, indoor_outdoor, interactivity_level, skill_level_required):
    insert_query = '''
    INSERT INTO event (title, organizer_id, description, image_url, start_time, end_time, latitude, longitude, price_structure, category, language, event_size, accessibility_features, age_restriction, indoor_outdoor, interactivity_level, skill_level_required) 
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
    '''
    try:
        connection = create_connection()
        if connection is not None:
            cursor = connection.cursor()
            cursor.execute(insert_query, (
                title,
                organizer_id,
                description,
                image_url,
                start_time,
                end_time,
                latitude,
                longitude,
                json.dumps(price_structure),
                category,
                json.dumps(language),
                event_size,
                json.dumps(accessibility_features),
                age_restriction,
                indoor_outdoor,
                interactivity_level,
                skill_level_required
            ))
            connection.commit()
    except Error as error:
        print("Error while inserting event: ", error)
    finally:
        if connection is not None and connection.is_connected():
            cursor.close()
            connection.close()

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
    SELECT e.*, c.name as category, (
        6371 * acos(
            cos(radians(%s)) * cos(radians(e.latitude)) * cos(radians(e.longitude) - radians(%s)) +
            sin(radians(%s)) * sin(radians(e.latitude))
        )
    ) AS distance,
    CASE WHEN se.event_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_saved,
    COUNT(DISTINCT se.id) AS amount_saved
    FROM event e
    LEFT JOIN saved_event se ON e.id = se.event_id
    LEFT JOIN event_category ec ON e.id = ec.event_id
    LEFT JOIN category c ON ec.category_id = c.id
    WHERE e.start_time >= %s AND e.start_time <= %s
    GROUP BY e.id, c.name
    HAVING distance <= %s
    ORDER BY e.start_time;
    """
    
    params = (latitude, longitude, latitude, int(start_date), int(end_date), radius)

    try:
        connection = create_connection()
        if connection is not None:
            cursor = connection.cursor(dictionary=True)
            cursor.execute(select_query, params)
            events = cursor.fetchall()
            cursor.close()
            connection.close()
            return events
    except Error as error:
        print("Error while fetching events: ", error)
        return []

@app.route('/api/v1/events.json/<int:user_id>', methods=['GET'])
def get_entries(user_id):
    try:
        latitude = float(request.args.get('latitude'))
        longitude = float(request.args.get('longitude'))
        radius = float(request.args.get('radius'))
        start_date = int(request.args.get('start_date'))
        end_date = int(request.args.get('end_date'))

        if None in [latitude, longitude, radius, start_date, end_date]:
            return jsonify({"error": "Missing parameters"}), 400

        data = get_events(user_id, latitude, longitude, radius, start_date, end_date)
        return jsonify(data), 200
    
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500


def get_foryou(user_id):
    select_query = """
        SELECT 
            e.*, 
            c.name as category,
            CASE WHEN se.event_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_saved,
            COUNT(DISTINCT se.id) AS amount_saved,
            (
                CASE
                    WHEN e.event_size = us.preferred_event_size THEN 10
                    ELSE 0
                END +
                CASE
                    WHEN e.language = us.preferred_languages THEN 10
                    ELSE 0
                END +
                CASE
                    WHEN e.age_restriction = us.age_preference THEN 10
                    ELSE 0
                END +
                CASE
                    WHEN e.indoor_outdoor = us.indoor_outdoor_preference THEN 10
                    ELSE 0
                END +
                CASE
                    WHEN e.interactivity_level = us.interactivity_preference THEN 10
                    ELSE 0
                END +
                CASE
                    WHEN e.expected_crowd_size = us.crowding_preference THEN 10
                    ELSE 0
                END +
                CASE
                    WHEN e.novelty_factor = us.novelty_preference THEN 10
                    ELSE 0
                END +
                CASE
                    WHEN e.skill_level_required = us.skill_level_preference THEN 10
                    ELSE 0
                END +
                CASE
                    WHEN e.networking_opportunities = us.networking_interest THEN 10
                    ELSE 0
                END +
                CASE
                    WHEN (
                        6371 * acos(
                            cos(radians(us.latitude)) * cos(radians(e.latitude)) * 
                            cos(radians(e.longitude) - radians(us.longitude)) +
                            sin(radians(us.latitude)) * sin(radians(e.latitude))
                        )
                    ) <= us.radius THEN 15
                    ELSE 0
                END
            ) AS compatibility_score
        FROM 
            event e
        LEFT JOIN 
            saved_event se ON e.id = se.event_id
        LEFT JOIN 
            event_category ec ON e.id = ec.event_id
        LEFT JOIN 
            category c ON ec.category_id = c.id
        JOIN 
            usersettings us ON us.user_id = %s
        WHERE 
            e.start_time >= UNIX_TIMESTAMP()
        GROUP BY 
            e.id, c.name
        HAVING 
            compatibility_score > 0
        ORDER BY 
            compatibility_score DESC, e.start_time
        LIMIT 50;
        
    """
        
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

def get_organizer(organizer_id):
    select_query = '''
    SELECT * FROM organizer WHERE id = %s
    '''
    try:
        connection = create_connection()
        if connection is not None:
            cursor = connection.cursor(dictionary=True)
            cursor.execute(select_query, (organizer_id,))
            organizer = cursor.fetchone()
            cursor.close()
            connection.close()
            return organizer
    except Error as error:
        print("Error while fetching organizer: ", error)
        return None

def get_saved_events(user_id):
    select_query = '''
    SELECT e.*, GROUP_CONCAT(DISTINCT c.name) as categories,
    TRUE AS is_saved,
    (SELECT COUNT(*) FROM saved_event WHERE event_id = e.id) AS amount_saved
    FROM saved_event se
    JOIN event e ON se.event_id = e.id
    LEFT JOIN event_category ec ON e.id = ec.event_id
    LEFT JOIN category c ON ec.category_id = c.id
    WHERE se.user_id = %s
    GROUP BY e.id
    ORDER BY e.start_time
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

def get_statistics(event_id):
    select_query = '''
        SELECT * FROM event_statistics WHERE event_id = %s
    '''
    try:
        connection = create_connection()
        if connection is not None:
            cursor = connection.cursor(dictionary=True)
            cursor.execute(select_query, (event_id))
            statistics = cursor.fetchone()
            cursor.close()
            connection.close()
            return statistics
    except Error as error:
        print("Error while fetching statistics: ", error)
        return None

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


############################
## API Endpoints     ##
############################



@app.route("/")
def index():
    return "<p>EventBuddy API</p>"

@app.route("/api/v1/health", methods=['GET'])
def health():
    return jsonify("OK")

@app.route("/api/v1/protected/health", methods=['GET'])
@jwt_required()
def protected_health():
    return jsonify("protected OK")

@app.route('/api/v1/refresh-token', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return jsonify(access_token=new_access_token), 200

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

    if not username or not password:
        return jsonify(error="Missing parameters"), 400

    user = get_user_by_username(username)

    if user and verify_password(password, user['password']):
        access_token = create_access_token(identity=user['id'])
        refresh_token = create_refresh_token(identity=user['id'])
        return jsonify(access_token=access_token, refresh_token=refresh_token, user_id=user['id'], message="Login successful"), 200
    return jsonify(error="Invalid credentials"), 401

@app.route("/api/v1/usersettings/<int:user_id>", methods=['POST'])
def api_post_user_settings(user_id):
    data = request.json

    # Daten aus dem JSON-Request entnehmen
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    radius = data.get('radius')
    include_international = data.get('include_international')
    notifications_enabled = data.get('notifications_enabled')
    preferred_languages = data.get('preferred_languages')
    preferred_event_size = data.get('preferred_event_size')
    price_range = data.get('price_range')
    preferred_times = data.get('preferred_times')
    accessibility_needs = data.get('accessibility_needs')
    age_preference = data.get('age_preference')
    transport_preference = data.get('transport_preference')
    indoor_outdoor_preference = data.get('indoor_outdoor_preference')
    interactivity_preference = data.get('interactivity_preference')
    novelty_preference = data.get('novelty_preference')
    skill_level_preference = data.get('skill_level_preference')
    crowding_preference = data.get('crowding_preference')
    mood_preference = data.get('mood_preference')
    social_preference = data.get('social_preference')

    try:
        # Die Funktion aufrufen, um die Daten einzufügen
        insert_user_settings(
            user_id,
            latitude,
            longitude,
            radius,
            include_international,
            notifications_enabled,
            preferred_languages,
            preferred_event_size,
            price_range,
            preferred_times,
            accessibility_needs,
            age_preference,
            transport_preference,
            indoor_outdoor_preference,
            interactivity_preference,
            novelty_preference,
            skill_level_preference,
            crowding_preference,
            mood_preference,
            social_preference
        )
        return jsonify({"message": "User settings inserted successfully"}), 200
    except Exception as e:
        # Fehlernachricht ausgeben, um Details zu erhalten
        return jsonify({"error": str(e)}), 500


@app.route('/api/v1/events.json/<int:user_id>', methods=['GET'])
#@jwt_required()
def api_get_entries(user_id):
    try:
        latitude = request.args.get('latitude')
        longitude = request.args.get('longitude')
        radius = request.args.get('radius')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')

        if not latitude or not longitude or not radius or not start_date or not end_date:
            return jsonify({"error": "Missing parameters"}), 400

        data = get_events(user_id, latitude, longitude, radius, start_date, end_date)
        return jsonify(data), 200
    
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/event.json', methods=['POST'])
#@jwt_required()
def create_event():
    try:
        data = request.json
        title = data.get('title')
        organizer_id = data.get('organizer_id')
        description = data.get('description')
        image_url = data.get('image_url')
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        start_time = data.get('start_time')
        end_time = data.get('end_time')
        price_structure = data.get('price_structure')
        event_size = data.get('event_size')
        language = data.get('language')
        category = data.get('category')
        accessibility_features = data.get('accessibility_features')
        age_restriction = data.get('age_restriction')
        indoor_outdoor = data.get('indoor_outdoor')
        interactivity_level = data.get('interactivity_level')
        skill_level_required = data.get('skill_level_required')

        insert_event(title,organizer_id,description,image_url, start_time, end_time, latitude, longitude, price_structure, category, language, event_size, accessibility_features, age_restriction, indoor_outdoor, interactivity_level,skill_level_required )
        return jsonify({"message": "Event created successfully"}), 201

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/event.json/<int:id>', methods=['GET'])
#@jwt_required()
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
#@jwt_required()
def api_get_user(id):
    try:
        user = get_user(id)
        if user is None:
            return jsonify({"error": "User not found"}), 404
        return jsonify(user), 200
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/organizer.json/<int:id>', methods=['GET'])
#@jwt_required()
def api_get_organizer(id):
    organizer = get_organizer(id)
    if organizer is None:
        return jsonify({"error": "Organizer not found"}), 404
    return jsonify(organizer), 200

@app.route('/api/v1/saved_events.json/<int:user_id>', methods=['GET'])
#@jwt_required()
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
#@jwt_required()
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
#@jwt_required()
def api_search():
    try:
        data = request.json
        text = data.get('text')

        results = search_events(text)
        return jsonify(results), 200
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/start/foryou/<int:user_id>', methods=['GET'])
#@jwt_required()
def api_get_foryou(user_id):
    if not user_id:
        return jsonify({"error": "User not found"}), 404
    events = get_foryou(user_id)
    return jsonify(events), 200

@app.route('/api/v1/categories.json', methods=['GET'])
def api_get_categories():
    categories = get_all_categories()
    return jsonify([category[1] for category in categories]), 200

@app.route('/api/v1/statistics.json/<int:event_id>', methods=['GET'])
def api_get_statistics(event_id):
    statistics = get_statistics(event_id)
    if statistics is None:
        return jsonify({"error": "Event not found"}), 404
    return jsonify(statistics), 200

create_organizer_table()
create_event_table()
create_user_table()
create_user_settings_table()
create_event_statistics_table()
create_category_table()
create_event_category_table()
create_saved_event_table()

print("running...")