import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os

# Carga las variables del archivo .env
load_dotenv()

def get_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME"),
            port=int(os.getenv("DB_PORT"))
        )
        return connection
    except Error as e:
        print(f"Error al conectar con MySQL: {e}")
        raise e