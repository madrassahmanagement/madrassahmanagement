# Madrassah Management System (MMS)

A comprehensive platform to manage students, teachers, staff, parents, and madrassah operations with specialized Islamic education tracking including Namaz tracking, Sabaq, Sabqi, Manzil progress, and discipline monitoring.

## 🚀 Features

### Core Modules

#### 1. Student Management
- Complete student profiles with guardian information
- Academic and Islamic studies progress tracking
- Attendance management with detailed reporting
- Health and fitness tracking
- Promotion/demotion system

#### 2. Namaz Tracking System
- Daily prayer tracking (5 times daily)
- Teacher and parent integration
- Missed prayer notifications
- Performance analytics and reporting

#### 3. Islamic Studies Tracking
- **Sabaq (New Lesson)**: Daily lesson tracking
- **Sabqi (Revision)**: Yesterday's lesson revision
- **Manzil (Long-term Revision)**: Extended revision tracking
- Word of the Day with multiple language support
- Daily Islamic knowledge (Hadith, Dua, Facts)
- Tajweed practice tracking
- Quran memorization progress

#### 4. Discipline & Fitness Management
- Behavior point system (positive/negative)
- Teacher satisfaction tracking
- Physical fitness monitoring
- BMI tracking and health status
- Activity and sports participation

#### 5. Teacher & Staff Management
- Teacher profiles with qualifications
- Class and subject assignments
- Performance evaluation system
- Leave management
- Homeroom teacher assignments

#### 6. Parent Portal
- Daily/weekly student reports
- Real-time notifications
- Communication with teachers
- Performance monitoring
- Fee management

#### 7. Communication & Reporting
- Daily student reports to parents
- Email/SMS notifications
- Parent-teacher communication portal
- Comprehensive analytics and dashboards

#### 8. Admin Features
- Complete system administration
- User role management
- Class and subject management
- System health monitoring
- Backup and recovery

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **multer** for file uploads
- **nodemailer** for email notifications
- **twilio** for SMS notifications

### Key Dependencies
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.5.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "express-validator": "^7.0.1",
  "multer": "^1.4.5-lts.1",
  "nodemailer": "^6.9.4",
  "twilio": "^4.15.0",
  "moment": "^2.29.4",
  "express-rate-limit": "^6.10.0"
}
```

## 📁 Project Structure

```
madrassah-management-system/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Teacher.js
│   │   ├── Parent.js
│   │   ├── Class.js
│   │   ├── Subject.js
│   │   ├── Attendance.js
│   │   ├── Namaz.js
│   │   ├── IslamicStudies.js
│   │   ├── Discipline.js
│   │   └── Fitness.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── students.js
│   │   ├── teachers.js
│   │   ├── parents.js
│   │   ├── staff.js
│   │   ├── attendance.js
│   │   ├── namaz.js
│   │   ├── islamicStudies.js
│   │   ├── discipline.js
│   │   ├── fitness.js
│   │   ├── classes.js
│   │   ├── reports.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js
│   └── index.js
├── client/ (Frontend - To be implemented)
├── package.json
├── env.example
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd madrassah-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/madrassah_mms
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   NODE_ENV=development
   
   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   
   # SMS Configuration (Twilio)
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Student Management
- `GET /api/students` - Get all students
- `POST /api/students` - Create new student
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student
- `GET /api/students/:id/attendance` - Get student attendance
- `GET /api/students/:id/performance` - Get student performance
- `POST /api/students/:id/promote` - Promote student

### Namaz Tracking
- `POST /api/namaz/mark` - Mark Namaz for student
- `GET /api/namaz/student/:id/:date` - Get Namaz record
- `GET /api/namaz/student/:id/history` - Get Namaz history
- `GET /api/namaz/missed/:date` - Get students with missed prayers
- `GET /api/namaz/class/:classId/summary` - Get class Namaz summary

### Islamic Studies
- `POST /api/islamic-studies/record` - Record Islamic studies progress
- `GET /api/islamic-studies/student/:id/:date` - Get Islamic studies record
- `GET /api/islamic-studies/student/:id/history` - Get Islamic studies history
- `GET /api/islamic-studies/class/:classId/summary` - Get class summary

### Attendance Management
- `POST /api/attendance/mark` - Mark attendance for class
- `GET /api/attendance/class/:classId/:section/:date` - Get class attendance
- `GET /api/attendance/student/:id` - Get student attendance
- `GET /api/attendance/summary/class/:classId` - Get attendance summary

### Reports & Analytics
- `GET /api/reports/dashboard` - Get dashboard statistics
- `GET /api/reports/attendance` - Get attendance report
- `GET /api/reports/namaz` - Get Namaz report
- `GET /api/reports/islamic-studies` - Get Islamic studies report
- `GET /api/reports/student/:id/comprehensive` - Get comprehensive student report

## 🔐 User Roles & Permissions

### Admin
- Full system access
- User management
- Class and subject management
- System configuration
- Reports and analytics

### Teacher
- Student management (assigned classes)
- Attendance marking
- Namaz tracking
- Islamic studies recording
- Discipline and fitness tracking
- Parent communication

### Parent
- View children's progress
- Receive notifications
- Communicate with teachers
- Update personal information

### Student
- View personal dashboard
- Check attendance and performance
- View Islamic studies progress

### Staff
- Basic profile management
- Limited system access

## 🌐 Multi-language Support

The system supports multiple languages:
- English (en)
- Urdu (ur)
- Arabic (ar)

Language preference can be set in user profiles and affects:
- UI text
- Reports
- Notifications
- Islamic content (Word of the Day, Hadith, Dua)

## 📱 Mobile Responsiveness

The system is designed to be fully responsive and mobile-friendly:
- Responsive design for all screen sizes
- Touch-friendly interface
- Mobile-optimized forms and navigation
- Offline capability for basic functions

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Rate limiting for API endpoints
- Input validation and sanitization
- Account lockout after failed attempts
- Two-factor authentication support

## 📊 Performance Monitoring

- Real-time performance tracking
- Attendance analytics
- Namaz performance metrics
- Islamic studies progress
- Discipline and behavior tracking
- Fitness and health monitoring

## 🚀 Future Enhancements

- AI-based progress prediction
- Gamification with points and badges
- Voice-enabled teacher reporting
- Advanced analytics and insights
- Mobile app development
- Integration with external systems
- Automated report generation
- Video conferencing integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Email: madrassahmanagement@gmail.com
- Documentation: [Link to documentation]
- Issues: [GitHub Issues]

## 🙏 Acknowledgments

- Islamic education community
- Open source contributors
- Beta testers and feedback providers

---

**Madrassah Management System** - Empowering Islamic education through technology.
