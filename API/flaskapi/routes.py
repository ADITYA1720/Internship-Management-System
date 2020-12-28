from flaskapi import app, db, bcrypt
from flaskapi.models import User, studentInfo, facultyInfo, internApplicants, internshipDetails, newInternships
from flask_login import login_user, current_user, logout_user, login_required
from flask import request, jsonify, abort, send_from_directory, send_file
from sqlalchemy import and_, or_
from email_validator import validate_email, EmailNotValidError
from datetime import datetime
import json
import re
 
# db.drop_all()
# db.create_all()

@app.route('/api/complete-profile', methods=['POST'])
def apicompleteprofile():
    if current_user.is_authenticated:
        return jsonify({'logged_in': 'True', 'message': 'Logout to register a new user'}), 401
    id = request.json.get('id')
    rollNumber = request.json.get('rollNumber')
    f_name = request.json.get('f_name')
    l_name = request.json.get('l_name')
    email = request.json.get('email')
    branch = request.json.get('branch')
    attendance = request.json.get('attendance')
    CGPA = request.json.get('CGPA')
    year = request.json.get('year')
    division = request.json.get('division')

    regex = re.compile('[@_!#$%^&*()<>?/\|}{~:]')

    if f_name is None or l_name is None or email is None or branch is None or CGPA is None or year is None or division is None:
        return jsonify({'message': 'Fields cannot be blank!'}), 400  # missing arguments
    if(any(chr.isdigit() for chr in f_name) or not(regex.search(f_name) == None)):
        return jsonify({'message': 'Invalid name'}), 400
    if(any(chr.isdigit() for chr in l_name) or not(regex.search(l_name) == None)):
        return jsonify({'message': 'Invalid name'}), 400
    if (type(CGPA) != float and type(CGPA) != int) or CGPA < 0.0:
        return jsonify({'message': 'Invalid CGPA'}), 400
    if (type(attendance) != float and type(attendance) != int) or attendance < 0.0 or attendance > 100.0:
        return jsonify({'message': 'Invalid attendance'}), 400
    if(not (year in ('FE', 'SE', 'TE', 'BE', 'PG'))):
        return jsonify({'message': 'Invalid year'}), 400
    if(type(division) != int) or division < 0 or division > 12:
        return jsonify({'message': 'Invalid division'}), 400
    bool_result = validate_email(email)
    if bool_result is False:
        return jsonify({'message': 'Invalid email'}), 400
    
    if studentInfo.query.filter_by(rollNumber = rollNumber).first():
        return jsonify({'registered': 'False', 'message': 'Roll number is already registered'}), 400    
    if studentInfo.query.filter_by(email=email).first():
        return jsonify({'registered': 'False', 'message': 'Email exists'}), 400


    student = studentInfo(id = id, rollNumber = rollNumber, f_name = f_name, l_name = l_name, CGPA = CGPA, attendance = attendance, year = year, division = division, branch = branch, email = email)
    db.session.add(student)
    db.session.commit()

    login_user(current_user, remember=True)
    return jsonify({'registered': 'True', 'message': 'Account Created', 'id':id}), 201


@app.route('/api/registeruser', methods=['POST'])
def apiregisterstudent():
    if current_user.is_authenticated:
        return jsonify({'logged_in': 'True', 'message': 'Logout to register a new user'}), 401
    id = request.json.get('id')
    password = request.json.get('password')
    role = request.json.get('role')
    regex = re.compile('[@_!#$%^&*()<>?/\|}{~:]')

    if id is None or password is None:
        return jsonify({'message': 'Fields cannot be blank!'}), 400  # missing arguments
    if len(id) < 8 or len(id) > 13:
        return jsonify({'message': 'Invalid id'}), 400          
    
    if User.query.filter_by(id=id).first():
        return jsonify({'registered': 'False', 'message': 'id is already registered'}), 400

    pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(id = id, password = pw_hash, role = role)
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'registered': 'True', 'message': 'Account Created', 'role': role}), 201

@app.route('/api/userlogin', methods=['POST','GET']) 
def apistudentlogin():
    if request.method == 'GET':
        if current_user.is_authenticated:
            return jsonify({'logged_in': 'True', 'message': 'User was Logged in Already', 'id':current_user.id}), 200
        else:
            return jsonify({'error': 'Invalid Request'}), 401
    if current_user.is_authenticated:
        return jsonify({'logged_in': 'True', 'message': 'User was logged in Already', 'role': current_user.role}), 200
    
    id = request.json.get('id')
    password = request.json.get('password')
    role = request.json.get('role')
    user = User.query.filter_by(id=id).first()
    if user and bcrypt.check_password_hash(user.password, password) and user.role == role:
        login_user(user, remember=True)
        return jsonify({'logged_in': 'True', 'message': 'User logged in', 'id': current_user.id, 'role': current_user.role}), 200
    else:
        return jsonify({'logged_in': 'False', 'message': 'Invalid credentials'}), 400

@app.route('/api/studentviewinternships', methods=['GET'])
def studentviewinternships():
    internships = None
    if current_user.is_authenticated and current_user.role == 0:
        student = studentInfo.query.filter_by(id=current_user.id).first()
        internships = newInternships.query.filter_by(department = student.branch).all()
    elif current_user.is_authenticated and current_user.role == 1:  
        faculty = facultyInfo.query.filter_by(id=current_user.id).first()
        internships = newInternships.query.filter_by(department = faculty.department).all() 
    elif current_user.is_authenticated and current_user.role == 2:
        internships = newInternships.query.all()
    else:
        return jsonify({ 'error': 'Invalid request' }), 400  

    interns = []
    for internship in internships:
        interns.append({ 'id': internship.internshipID, 'teacherID': internship.teacherID, 'position': internship.position, 'company': internship.company, 'stipend': internship.stipend, 'duration': internship.duration, 'startDate': internship.startDate, 'endDate': internship.endDate, 'description': internship.description, 'branch': internship.department, 'imageURL': internship.imageURL })
    
    return jsonify({'internships': interns, 'valid_request': 'True'}), 200

@app.route('/api/studentviewinternshipsdetails/<internshipID>', methods=['GET'])
def viewstudentinternships(internshipID):
    if current_user.is_authenticated:
        internship = newInternships.query.filter_by(internshipID = internshipID).first()
        interns = []
        interns.append({ 'id': internship.internshipID, 'teacherID': internship.teacherID, 'position': internship.position, 'company': internship.company, 'stipend': internship.stipend, 'duration': internship.duration, 'startDate': internship.startDate, 'endDate': internship.endDate, 'description': internship.description, 'branch': internship.department })
        return jsonify({'valid_request': 'True', 'internships': interns}), 200

    return jsonify({ 'valid_request': 'False', 'error': 'Invalid request' }), 400
    
@app.route('/api/studentapply', methods=['POST'])
def studentapply():
    if current_user.is_authenticated and current_user.role == 0:
        internshipID = request.form.get('internshipID')
        internship = newInternships.query.filter_by(internshipID = internshipID).first()
        checkIfApplied = internApplicants.query.filter_by(internshipID = internshipID, studentID = current_user.id).first()
        if(checkIfApplied):
            return jsonify({'error': 'Internship already applied for!'}), 400
        file = request.files['file']
        filetype = file.filename.rsplit('.', 1)[1].lower()        
        filename = current_user.id + "_resume_" + str(internshipID) + "." + filetype
        destination="/".join([app.config['UPLOAD_FOLDER'], filename])
        file.save(destination)
        studentApplicant = internApplicants(teacherID = internship.teacherID, internshipID = internshipID, studentID = current_user.id, status = 0)
        db.session.add(studentApplicant)
        db.session.commit()
        return jsonify({ 'applicantRegistered': 'True', 'message': 'Application sent.'}), 200
    
    return jsonify({'error': 'Invalid request'}), 400

@app.route('/api/viewstudentprofile', methods=['GET'])
def studentviewprofile():
    if current_user.is_authenticated and current_user.role == 0:
        student = studentInfo.query.filter_by(id = current_user.id).first()
        return jsonify({ 'valid_request': 'True', 'id': student.id, 'rollNumber': student.rollNumber, 'name': student.f_name + ' ' + student.l_name, 'CGPA': student.CGPA, 'attendance': student.attendance, 'class': student.year + ' ' + str(student.division), 'department': student.branch, 'email': student.email}), 200

    return jsonify({'error': 'Invalid request'}), 400


@app.route('/api/studentviewstatus', methods=['GET'])
def studentviewstatus():
    if current_user.is_authenticated and current_user.role == 0:
        externalApplications = internshipDetails.query.filter_by(studentID = current_user.id).all()
        collegeInternshipApplications = internApplicants.query.filter_by(studentID = current_user.id).all()
        allApplications = []

        collegeApplicantsStatus = {
            0: 'Not viewed',
            1: 'Viewed',
            2: 'Rejected',
            3: 'Approved'
        }
        for internship in collegeInternshipApplications:
            currentInternship = newInternships.query.filter_by(internshipID = internship.internshipID).first()
            allApplications.append({'id': internship.internshipID, 'company': currentInternship.company, 'typeOfApplication': 'College internship application', 'status': collegeApplicantsStatus.get(internship.status) })

        for extInternship in externalApplications:
            allApplications.append({'id': extInternship.formID, 'company': extInternship.company, 'typeOfApplication': 'External internship approval application', 'status': collegeApplicantsStatus.get(extInternship.status)})

        return jsonify({ 'valid_request': 'True', 'internshipStatuses': allApplications }), 200

    return jsonify({ 'error': 'Invalid request'}), 400


@app.route('/api/requestapproval', methods=['POST'])
def requestapproval():
    if current_user.is_authenticated and current_user.role == 0:
        studentID = current_user.id
        company = request.form.get("company")
        position = request.form.get("position")
        stipend = request.form.get("stipend")
        duration = request.form.get("duration")
        startDate = request.form.get("startDate")
        endDate = request.form.get("endDate")
        startDate = datetime.strptime(startDate, '%Y-%m-%d')
        endDate = datetime.strptime(endDate, '%Y-%m-%d')
        additionalDetails = request.form.get("additionalDetails")
        checkIfApplied = internshipDetails.query.filter_by(studentID = current_user.id, company = company).first()
        if(checkIfApplied):
            return jsonify({'error': 'Internship approval already requested for this company.'}), 400
        file = request.files['file']        
        filetype = file.filename.rsplit('.', 1)[1].lower()
        filename = current_user.id + "_offer_letter_" + company + "." + filetype
        destination="/".join([app.config['UPLOAD_FOLDER'], filename])
        file.save(destination)
        internship_dets = internshipDetails(studentID=studentID, company=company, position=position, stipend=stipend, duration=duration, startDate=startDate, endDate=endDate, additionalDetails=additionalDetails, status=0)
        db.session.add(internship_dets)
        db.session.commit()

        return jsonify({'message': 'Approval request sent.'}), 201

    return jsonify({'error': 'Invalid request'}), 400        

@app.route('/api/complete-profile-teacher', methods=['POST'])
def apiregisterteacher():
    if current_user.is_authenticated:
        return jsonify({'logged_in': 'True', 'message': 'Logout to register a new user'}), 401
    id = request.json.get('id')
    f_name = request.json.get('f_name')
    l_name = request.json.get('l_name')
    email = request.json.get('email')
    department = request.json.get('department')
    regex = re.compile('[@_!#$%^&*()<>?/\|}{~:]')

    if id is None or f_name is None or l_name is None or email is None or department is None:
        return jsonify({'message': 'Fields cannot be blank!'}), 400  # missing arguments
    if len(id) < 8 or len(id) > 13:
        return jsonify({'message': 'Invalid id'}), 400          
    if(any(chr.isdigit() for chr in f_name) or not(regex.search(f_name) == None)):
        return jsonify({'message': 'Invalid name'}), 400
    if(any(chr.isdigit() for chr in l_name) or not(regex.search(l_name) == None)):
        return jsonify({'message': 'Invalid name'}), 400
    bool_result = validate_email(email)
    if bool_result is False:
        return jsonify({'message': 'Invalid email'}), 400
    if facultyInfo.query.filter_by(email=email).first():
        return jsonify({'registered': 'False', 'message': 'Email exists'}), 400
    
    user = User.query.filter_by(id=id).first()
    
    faculty = facultyInfo(id = id, f_name = f_name, l_name = l_name, email = email, department = department)
    db.session.add(faculty)
    db.session.commit()

    login_user(user, remember=True)
    return jsonify({'registered': 'True', 'message': 'Account Created','id': id}), 201

@app.route('/api/facultylogin', methods=['POST','GET'])
def apilogin():
    if request.method == 'GET':
        if current_user.is_authenticated:
            return jsonify({'logged_in': 'True', 'message': 'User was Logged in Already','id':current_user.id}), 200
        else:
            return jsonify({'error': 'Invalid Request'}), 401
    if current_user.is_authenticated:
        return jsonify({'logged_in': 'True', 'message': 'User was logged in Already'}), 200
    
    id = request.json.get('id')
    password = request.json.get('password')
    user = User.query.filter_by(id=id).first()
    if user and bcrypt.check_password_hash(user.password, password) and user.role != 0:
        login_user(user, remember=True)
        return jsonify({'logged_in': 'True', 'message': 'User logged in', 'id':current_user.id}), 200
    else:
        return jsonify({'logged_in': 'False', 'message': 'Invalid credentials'}), 400


@app.route('/api/viewteacherprofile', methods=['GET'])
def teacherviewprofile():
    if current_user.is_authenticated and current_user.role != 0:
        faculty = facultyInfo.query.filter_by(id = current_user.id).first()
        rolesStatus = {
            1: 'Department Internship Head',
            2: 'Institute Coordinator'
        }
        return jsonify({ 'valid_request': 'True', 'id': faculty.id, 'name': faculty.f_name + ' ' + faculty.l_name, 'department': faculty.department, 'email': faculty.email, 'role': rolesStatus.get(current_user.role)}), 200

    return jsonify({'error': 'Invalid request'}), 400


@app.route('/api/logout', methods=['GET', 'POST'])
def apilogout():
    if current_user.is_authenticated:
        logout_user()
        return jsonify({'logged_out': 'True', 'message': 'User logged out'}), 200
    else:
        return jsonify({'error': 'Invalid Request'}), 401

@app.route('/api/addinternship', methods=['POST'])
def apiaddinternship():
    if current_user.is_authenticated and current_user.role != 0:
        faculty = facultyInfo.query.filter_by(id=current_user.id).first()
        position = request.json.get('position')        
        company = request.json.get('company')
        stipend = request.json.get('stipend')
        duration = request.json.get('duration')
        startDate = request.json.get('startDate')
        endDate = request.json.get('endDate')
        startDate = datetime.strptime(startDate, '%Y-%m-%d')
        endDate = datetime.strptime(endDate, '%Y-%m-%d')
        description = request.json.get('description')
        branch = request.json.get('branch')
        imageURL = request.json.get('imageURL')
        newintern = newInternships(teacherID = current_user.id, position = position, company = company, stipend = stipend, duration = duration, startDate = startDate, endDate = endDate, description = description, department = branch, imageURL = imageURL)
        db.session.add(newintern)
        db.session.commit()
        return jsonify({ 'message': 'Internship added'}), 201
    
    return jsonify({ 'error': 'Invalid request' }), 400

@app.route('/api/view-added-internships', methods = ['GET'])
def apigetinternships():
    if current_user.is_authenticated and current_user.role != 0:
        internships = newInternships.query.filter_by(teacherID = current_user.id).all()
        interns = []
        for internship in internships:
            interns.append({ 'id': internship.internshipID, 'position': internship.position, 'company': internship.company, 'stipend': internship.stipend, 'duration': internship.duration, 'startDate': internship.startDate, 'endDate': internship.endDate, 'description': internship.description, 'branch': internship.department })

        return jsonify({'internships': interns}), 200

    return jsonify({ 'error': 'Invalid request' }), 400

@app.route('/api/view-responses/<internshipID>', methods = ['GET'])
def apiviewresponses(internshipID):
    if current_user.is_authenticated and current_user.role != 0:
        applicants = internApplicants.query.filter_by(internshipID = internshipID).all()
        internApplicants.query.filter_by(internshipID = internshipID).update({"status": 1})
        db.session.commit()
        studentResponses = []
        for applicant in applicants:
            student = studentInfo.query.filter_by(id = applicant.studentID).first()
            studentResponses.append({ 'id': student.id, 'rollNumber': student.rollNumber, 'name': student.f_name + ' ' + student.l_name, 'class': student.year + '-' + str(student.division)})

        return jsonify({ 'valid_request': 'True', 'studentResponses': studentResponses }), 200

    return jsonify({ 'error': 'Invalid request' }), 400

@app.route('/api/view-applicant-profile/<studentID>', methods = ['GET'])
def apiviewapplicantprofile(studentID):
    if current_user.is_authenticated and current_user.role != 0:
        studentID = str(studentID)
        student = studentInfo.query.filter_by(id = studentID).first()
        try:
            return jsonify({ 'valid_request': 'True', 'id': student.id, 'rollNumber': student.rollNumber, 'name': student.f_name + ' ' + student.l_name, 'class': student.year + ' ' + str(student.division), 'CGPA': student.CGPA, 'attendance': student.attendance, 'department': student.branch, 'email': student.email }), 200
        except:
            return jsonify({ 'error': 'Student not found' }), 400
    
    return jsonify({ 'error': 'Invalid request' }), 400

@app.route('/api/view-status-teacher', methods = ['GET'])
def apiviewapprovalrequests():
    if current_user.is_authenticated and current_user.role != 0:
        applications = db.session.query(internshipDetails).filter(internshipDetails.status < 2)
        applicationDetails = []
        for application in applications:
            student = studentInfo.query.filter_by(id = application.studentID).first()
            applicationDetails.append({ 'id': application.formID, 'studentID': student.id, 'name': student.f_name + ' ' + student.l_name, 'company': application.company})

        return jsonify({'valid_request': 'True', 'applications': applicationDetails})

    return jsonify({ 'error': 'Invalid request' }), 400

@app.route('/api/view-approval-request-details/<formID>', methods = ['GET'])
def apiviewappdetails(formID):
    if current_user.is_authenticated and current_user.role != 0:
        application = internshipDetails.query.filter_by(formID = formID).first()
        student = studentInfo.query.filter_by(id = application.studentID).first()
        return jsonify({'valid_request': 'True', 'id': application.formID, 'name': student.f_name + ' ' + student.l_name, 'rollNumber': student.rollNumber, 'CGPA': student.CGPA, 'attendance': student.attendance, 'company': application.company, 'startDate': application.startDate, 'endDate': application.endDate, 'duration': application.duration, 'stipend': application.stipend, 'additionalDetails': application.additionalDetails, 'position': application.position}), 200

    return jsonify({ 'error': 'Invalid request' }), 400

@app.route('/api/approve-application/<formID>', methods = ['PATCH'])
def apiapproveapplication(formID):
    if current_user.is_authenticated and current_user.role != 0:
        internshipDetails.query.filter_by(formID = formID).update({"status": 3})
        db.session.commit()
        return jsonify({'valid_request': 'True'}), 200

    return jsonify({ 'error': 'Invalid request' }), 400 

@app.route('/api/reject-application/<formID>', methods = ['PATCH'])
def apirejectapplication(formID):
    if current_user.is_authenticated and current_user.role != 0:
        internshipDetails.query.filter_by(formID = formID).update({"status": 2})
        db.session.commit()
        return jsonify({'valid_request': 'True'}), 200

    return jsonify({ 'error': 'Invalid request' }), 400 

@app.route('/api/download-offer-letter/<studentID>/<company>', methods = ['GET'])
def apidownloadofferletter(studentID, company):
    # uploads = os.path.join(current_app.root_path, app.config['UPLOAD_FOLDER'])
    filename = studentID + "_offer_letter_" + company + ".pdf"
    file_path = app.config['UPLOAD_FOLDER'] + '/' + filename
    return send_file(file_path, as_attachment=True, attachment_filename=filename)

@app.route('/api/download-student-resume/<studentID>/<internshipID>', methods = ['GET'])
def apidownloadresume(studentID, internshipID):
    # uploads = os.path.join(current_app.root_path, app.config['UPLOAD_FOLDER'])
    filename = studentID + "_resume_" + internshipID + ".pdf"
    file_path = app.config['UPLOAD_FOLDER'] + '/' + filename
    return send_file(file_path, as_attachment=True, attachment_filename=filename)


        