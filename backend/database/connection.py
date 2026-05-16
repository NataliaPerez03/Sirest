import mysql.connector
from mysql.connector import Error

def get_connection():
    try:
        connection = mysql.connector.connect(
            host="yamanote.proxy.rlwy.net",
            user="root",
            password="PYipyKBUbVAJvNdmLMsnPhoYHoFjJOKD",
            database="railway",
            port=36471
        )
        return connection
    except Error as e:
        print(f"Error al conectar con MySQL: {e}")
        raise e