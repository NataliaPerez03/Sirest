import mysql.connector.pooling
from dotenv import load_dotenv
from urllib.parse import urlparse
import os

load_dotenv()

_pool = None


def _build_params() -> dict:
    database_url = os.getenv("DATABASE_URL")
    if database_url:
        parsed = urlparse(database_url)
        return {
            "host": parsed.hostname,
            "user": parsed.username,
            "password": parsed.password,
            "database": parsed.path.lstrip("/"),
            "port": parsed.port or 3306,
        }
    return {
        "host": os.getenv("DB_HOST"),
        "user": os.getenv("DB_USER"),
        "password": os.getenv("DB_PASSWORD"),
        "database": os.getenv("DB_NAME"),
        "port": int(os.getenv("DB_PORT", 3306)),
    }


def _init_pool():
    global _pool
    params = _build_params()
    _pool = mysql.connector.pooling.MySQLConnectionPool(
        pool_name="sirest_pool",
        pool_size=5,
        **params,
    )


def get_connection():
    global _pool
    if _pool is None:
        _init_pool()
    return _pool.get_connection()
