from flask import Flask
from flask import render_template

app = Flask(__name__)

@app.route("/komecixtine")
def blog():
    return render_template("index.html")

@app.route("/")
def route():
    return "Ya rien ici degage ! Cordialement."

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80, debug=True)
