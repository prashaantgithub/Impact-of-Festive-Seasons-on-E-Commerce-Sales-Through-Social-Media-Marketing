from app import create_app
from database import db
from seed_generator import seed_all_data
import os

def initialize_project_database():
    app = create_app()
    with app.app_context():
        # Ensure the database directory exists
        db_dir = os.path.join(os.path.abspath(os.path.dirname(__file__)), '../database')
        if not os.path.exists(db_dir):
            os.makedirs(db_dir)
            print(f"Created directory: {db_dir}")

        print("Initializing database tables...")
        db.create_all()
        
        print("Starting data generation pipeline...")
        try:
            seed_all_data()
            print("Successfully seeded historical festive data.")
        except Exception as e:
            print(f"Error during seeding: {e}")

if __name__ == '__main__':
    initialize_project_database()