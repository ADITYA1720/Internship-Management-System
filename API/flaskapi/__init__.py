from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_login import LoginManager
from datetime import timedelta

app = Flask(__name__)
CORS(app, supports_credentials = True)
UPLOAD_FOLDER = 'C:/Users/sidha/Desktop/InternshipApproval/resumes'

app.config['SECRET_KEY'] = 'WjEbdafowg3pomkg.nlZHU6'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config["REMEMBER_COOKIE_DURATION"] = timedelta(days=30)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)

from flaskapi import routes



