import os

# Define base directory of the backend folder
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    # Database configuration
    # Points to the 'database' folder at the root level
    DB_PATH = os.path.join(BASE_DIR, '../database/ecommerce_festive.db')
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{DB_PATH}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Security (Dev key for this academic project)
    SECRET_KEY = 'festive-analytics-secret-key-cia3'