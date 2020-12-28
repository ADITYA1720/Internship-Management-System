import json
from sqlalchemy import ForeignKey
from flaskapi import db, login_manager, app
from flask_login import UserMixin
from datetime import datetime

# login_serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)

class User(db.Model, UserMixin):
    id = db.Column(db.String(25), primary_key = True)
    password = db.Column(db.String(60), nullable = False)
    role = db.Column(db.Integer, nullable = False)

class studentInfo(db.Model):
    id = db.Column(db.String(25), ForeignKey(User.id), primary_key = True)
    rollNumber = db.Column(db.Integer, unique = True, nullable = False)
    f_name = db.Column(db.String(30), nullable = False)
    l_name = db.Column(db.String(30), nullable = False)
    CGPA = db.Column(db.Float, nullable = False)
    attendance = db.Column(db.Float, nullable = False)
    year = db.Column(db.String(2), nullable = False)
    division = db.Column(db.Integer, nullable = False)
    branch = db.Column(db.String(40), nullable = False)
    email = db.Column(db.String(120), unique = True, nullable = False)

class facultyInfo(db.Model):
    id = db.Column(db.String(25), ForeignKey(User.id), primary_key = True)
    f_name = db.Column(db.String(30), nullable = False)
    l_name = db.Column(db.String(30), nullable = False)
    email = db.Column(db.String(120), unique = True, nullable = False)
    department = db.Column(db.String(40), nullable = False)
    
class internshipDetails(db.Model):
    formID = db.Column(db.Integer, primary_key = True)
    studentID = db.Column(db.String(25), ForeignKey(studentInfo.id))
    company = db.Column(db.String(50), nullable = False)
    position = db.Column(db.String(100), nullable = False)
    stipend = db.Column(db.Integer)
    duration = db.Column(db.Integer)
    startDate = db.Column(db.Date, nullable = False)
    endDate = db.Column(db.Date, nullable = False)
    additionalDetails = db.Column(db.String(10000))
    status = db.Column(db.Integer)

class newInternships(db.Model):
    internshipID = db.Column(db.Integer, primary_key = True)
    teacherID = db.Column(db.String(25), ForeignKey(facultyInfo.id))
    position = db.Column(db.String(100), nullable = False)
    company = db.Column(db.String(50), nullable = False)
    stipend = db.Column(db.Integer)
    duration = db.Column(db.Integer)
    startDate = db.Column(db.Date, nullable = False)
    endDate = db.Column(db.Date, nullable = False)
    description = db.Column(db.String(10000))
    department = db.Column(db.String(40))
    imageURL = db.Column(db.String(200))

class internApplicants(db.Model):
    teacherID = db.Column(db.String(25), ForeignKey(newInternships.teacherID), primary_key = True)
    internshipID = db.Column(db.Integer, ForeignKey(newInternships.internshipID), primary_key = True)
    studentID = db.Column(db.String(25), ForeignKey(studentInfo.id), primary_key = True)
    status = db.Column(db.Integer)
