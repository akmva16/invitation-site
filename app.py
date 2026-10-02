from flask import Flask, render_template, request, jsonify
from datetime import datetime
import os
import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

app = Flask(__name__)

# Файлы (полные пути — чтобы точно нашли)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MESSAGES_FILE = os.path.join(BASE_DIR, "messages.txt")
COUNTER_FILE = os.path.join(BASE_DIR, "visits.json")


# ===== СЧЁТЧИК ПОСЕЩЕНИЙ =====
def load_counter():
    """Загружает счётчик из файла"""
    if os.path.exists(COUNTER_FILE):
        try:
            with open(COUNTER_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Ошибка чтения счётчика: {e}")
    return {"visits": 0, "last_visit": "", "first_visit": ""}


def save_counter(data):
    """Сохраняет счётчик в файл"""
    try:
        with open(COUNTER_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f">>> Счётчик сохранён: {data['visits']} посещений")
    except Exception as e:
        print(f"Ошибка записи счётчика: {e}")


def increment_visit():
    """Увеличивает счётчик посещений"""
    data = load_counter()
    now = datetime.now().strftime("%d.%m.%Y %H:%M:%S")

    data["visits"] = data.get("visits", 0) + 1
    data["last_visit"] = now
    if not data.get("first_visit"):
        data["first_visit"] = now

    save_counter(data)
    return data["visits"]


# ===== МАРШРУТЫ =====
@app.route("/")
def home():
    """Главная страница — приглашение"""
    print(">>> Кто-то зашёл на главную!")
    visits = increment_visit()
    return render_template("index.html", visits=visits)
@app.route("/api/messages")
def get_messages():
    """Показывает содержимое messages.txt"""
    if os.path.exists(MESSAGES_FILE):
        with open(MESSAGES_FILE, "r", encoding="utf-8") as f:
            content = f.read()
    else:
        content = "Пока никто не отвечал"
    return f"<pre style='font-size:18px; padding:20px'>{content}</pre>"

@app.route("/api/visits")
def get_visits():
    """Возвращает текущее число посещений"""
    data = load_counter()
    return jsonify(data)


@app.route("/api/answer", methods=["POST"])
def answer():
    """Принимает ответ от Андрея (Да/Нет/Сообщение)"""
    data = request.get_json() or {}

    answer_type = data.get("type", "unknown")
    date = data.get("date", "")
    message = data.get("message", "")

    timestamp = datetime.now().strftime("%d.%m.%Y %H:%M:%S")
    entry = f"\n===== {timestamp} =====\n"
    entry += f"Ответ: {answer_type}\n"
    if date:
        entry += f"Дата: {date}\n"
    if message:
        entry += f"Сообщение: {message}\n"

    with open(MESSAGES_FILE, "a", encoding="utf-8") as f:
        f.write(entry)

    # Вывод в консоль с правильной кодировкой
    print(f">>> Ответ сохранён: {answer_type}")
    if message:
        print(f"    Сообщение: {message}")
    
    return jsonify({"status": "ok", "received": answer_type})

if __name__ == "__main__":
    print("=" * 50)
    print("  ЗАПУСК СЕРВЕРА ПРИГЛАШЕНИЙ")
    print(f"  Папка: {BASE_DIR}")
    print(f"  Файл счётчика: {COUNTER_FILE}")
    print("=" * 50)
    app.run(debug=True)