from flask import Flask, request, jsonify, render_template
import json
import os

app = Flask(__name__, template_folder='templates', static_folder='static')
DATA_FILE = 'data.json'

# Funcion para cargar datos desde un archivo JSON
def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return []

# Funcion para guardar datos en un archivo JSON
def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

# Ruta para la página de inicio
@app.route('/')
def home():
    data = load_data()
    return render_template('index.html', users=data)

# GET, POST, DELETE y PUT del /data
@app.route('/data', methods=['GET', 'POST', 'DELETE', 'PUT'])
def data():
    if request.method == 'GET':
        return jsonify(load_data())

    if request.method == 'POST':
        new_data = request.get_json()
        if not new_data or 'name' not in new_data or 'email' not in new_data:
            return jsonify({"error": "Falta, nombre o correo electrónico en la solicitud"}), 400
        data = load_data()
        new_data['id'] = len(data) + 1
        data.append(new_data)
        save_data(data)
        return jsonify(new_data), 201
    
    if request.method == 'DELETE':
        data = load_data()
        if not data:
            return jsonify({"error": "No hay datos para eliminar"}), 404
        deleted_data = data.pop()
        save_data(data)
        return jsonify(deleted_data), 200
    
    if request.method == 'PUT':
        updated_data = request.get_json()
        if not updated_data or 'id' not in updated_data or 'name' not in updated_data or 'email' not in updated_data:
            return jsonify({"error": "Falta ID, nombre o correo electrónico en la solicitud"}), 400
        user_id = int(updated_data['id'])
        data = load_data()
        for i, item in enumerate(data):
            if item['id'] == user_id:
                data[i] = {
                    'id': user_id,
                    'name': updated_data['name'],
                    'email': updated_data['email']
                }
                save_data(data)
                return jsonify(data[i]), 200
        return jsonify({"error": "Dato no encontrado"}), 404

# Obtener datos por ID
@app.route('/data/<int:data_id>', methods=['GET'])
def data_by_id(data_id):
    data = load_data()
    for item in data:
        if item['id'] == data_id:
            return jsonify(item)
    return jsonify({"error": "Dato no encontrado"}), 404

# Inicializar la aplicación
if __name__ == '__main__':
    app.run()