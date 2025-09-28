#!/usr/bin/env python3
"""
Скрипт для генерации хеша пароля
"""

import bcrypt

def hash_password(password: str) -> str:
    """Генерирует хеш пароля"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

if __name__ == "__main__":
    password = "admin123"
    hashed = hash_password(password)
    print(f"Пароль: {password}")
    print(f"Хеш: {hashed}")
