import sqlite3
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "chatbot.db"


def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db():
    connection = get_connection()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS chat_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            role TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    connection.commit()
    connection.close()


def save_message(role, message):
    connection = get_connection()

    cursor = connection.execute(
        """
        INSERT INTO chat_messages (role, message)
        VALUES (?, ?)
        """,
        (role, message)
    )

    connection.commit()

    message_id = cursor.lastrowid

    connection.close()

    return message_id


def get_messages():
    connection = get_connection()

    cursor = connection.execute(
        """
        SELECT id, role, message, created_at
        FROM chat_messages
        ORDER BY id ASC
        """
    )

    messages = [dict(row) for row in cursor.fetchall()]

    connection.close()

    return messages