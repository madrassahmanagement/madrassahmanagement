export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'admin' | 'teacher' | 'student' | 'parent' | 'staff' | 'nazim' | 'mudir' | 'raises_jamia' | 'shaikul_hadees' | 'senior_mentor' | 'management';
  profilePicture?: string;
  language: 'en' | 'ur' | 'ar';
  lastLogin?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  studentId: string;
  admissionNumber: string;
  admissionDate: string;
  currentClass: string;
  section: string;
  rollNumber: string;
  guardian: {
    father: {
      name: string;
      phone: string;
      occupation?: string;
      cnic?: string;
    };
    mother: {
      name: string;
      phone: string;
      occupation?: string;
      cnic?: string;
    };
    emergencyContact?: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
  academicYear: string;
  previousClass?: string;
  promotionDate?: string;
  quranLevel: 'beginner' | 'intermediate' | 'advanced' | 'hafiz';
  currentSurah?: string;
  currentAyah?: number;
  memorizationProgress: number;
  health: {
    bloodGroup?: string;
    allergies: string[];
    medicalConditions: string[];
    emergencyMedication?: string;
    doctorName?: string;
    doctorPhone?: string;
  };
  overallPerformance: number;
  attendancePercentage: number;
  namazPercentage: number;
  status: 'active' | 'inactive' | 'suspended' | 'graduated' | 'transferred';
  feeStatus: 'paid' | 'pending' | 'exempt' | 'overdue';
  monthlyFee: number;
  user: User;
}

export interface Teacher {
  id: string;
  teacherId: string;
  employeeId: string;
  joiningDate: string;
  qualification: {
    degree?: string;
    institution?: string;
    year?: number;
    specialization?: string;
  };
  experience: {
    totalYears: number;
    previousInstitutions: Array<{
      name: string;
      position: string;
      duration: string;
    }>;
  };
  subjects: string[];
  assignedClasses: Array<{
    class: string;
    section: string;
    subject?: string;
  }>;
  isHomeroomTeacher: boolean;
  homeroomClass?: string;
  homeroomSection?: string;
  performance: {
    overallRating: number;
    lastEvaluation?: string;
    evaluationHistory: Array<{
      date: string;
      rating: number;
      comments: string;
      evaluatedBy: string;
    }>;
  };
  attendance: {
    totalWorkingDays: number;
    presentDays: number;
    leaveBalance: number;
    leaveHistory: Array<{
      date: string;
      type: 'sick' | 'personal' | 'emergency' | 'other';
      reason: string;
      status: 'pending' | 'approved' | 'rejected';
      approvedBy?: string;
    }>;
  };
  salary: {
    basic: number;
    allowances: Array<{
      type: string;
      amount: number;
    }>;
    total: number;
  };
  emergencyContact: {
    name?: string;
    relationship?: string;
    phone?: string;
    address?: string;
  };
  status: 'active' | 'inactive' | 'on_leave' | 'terminated';
  user: User;
}

export interface Parent {
  id: string;
  parentId: string;
  relationship: 'father' | 'mother' | 'guardian' | 'grandfather' | 'grandmother' | 'uncle' | 'aunt';
  children: string[];
  occupation?: string;
  workplace?: string;
  monthlyIncome?: number;
  education: {
    level?: 'primary' | 'secondary' | 'higher_secondary' | 'bachelor' | 'master' | 'phd' | 'other';
    institution?: string;
    year?: number;
  };
  primaryPhone: string;
  secondaryPhone?: string;
  emergencyContact: {
    name?: string;
    relationship?: string;
    phone?: string;
  };
  communicationPreferences: {
    email: {
      enabled: boolean;
      frequency: 'daily' | 'weekly' | 'monthly';
    };
    sms: {
      enabled: boolean;
      frequency: 'daily' | 'weekly' | 'monthly';
    };
    pushNotifications: {
      enabled: boolean;
    };
  };
  notificationSettings: {
    attendanceAlerts: boolean;
    namazAlerts: boolean;
    disciplineAlerts: boolean;
    performanceAlerts: boolean;
    generalUpdates: boolean;
  };
  engagement: {
    lastLogin?: string;
    totalLogins: number;
    reportsViewed: number;
    messagesSent: number;
    feedbackProvided: number;
  };
  feeManagement: {
    paymentMethod: 'cash' | 'bank_transfer' | 'mobile_banking' | 'other';
    paymentHistory: Array<{
      date: string;
      amount: number;
      method: string;
      status: 'pending' | 'completed' | 'failed';
      transactionId?: string;
    }>;
    outstandingAmount: number;
  };
  status: 'active' | 'inactive' | 'suspended';
  user: User;
}

export interface Class {
  id: string;
  name: string;
  level: string;
  description?: string;
  academicYear: string;
  maxStudents: number;
  currentStudents: number;
  sections: Array<{
    name: string;
    maxStudents: number;
    currentStudents: number;
    homeroomTeacher?: string;
  }>;
  subjects: Array<{
    subject: string;
    teacher: string;
    weeklyHours: number;
  }>;
  schedule: {
    startTime?: string;
    endTime?: string;
    days: string[];
  };
  islamicStudies: {
    quranRecitation: {
      enabled: boolean;
      weeklyHours: number;
    };
    quranMemorization: {
      enabled: boolean;
      weeklyHours: number;
    };
    tajweed: {
      enabled: boolean;
      weeklyHours: number;
    };
    hadith: {
      enabled: boolean;
      weeklyHours: number;
    };
    seerah: {
      enabled: boolean;
      weeklyHours: number;
    };
    arabic: {
      enabled: boolean;
      weeklyHours: number;
    };
  };
  performanceMetrics: {
    averageAttendance: number;
    averageNamaz: number;
    averageAcademic: number;
    lastUpdated?: string;
  };
  status: 'active' | 'inactive' | 'archived';
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  type: 'academic' | 'islamic' | 'language' | 'physical' | 'art' | 'other';
  islamicCategory?: 'quran_recitation' | 'quran_memorization' | 'tajweed' | 'hadith' | 'seerah' | 'arabic' | 'fiqh' | 'aqeedah' | 'other';
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  credits: number;
  curriculum: {
    objectives: string[];
    learningOutcomes: string[];
    topics: Array<{
      name: string;
      description: string;
      duration: number;
      order: number;
    }>;
    assessmentMethods: string[];
  };
  resources: {
    textbooks: Array<{
      title: string;
      author: string;
      publisher: string;
      edition: string;
      isbn: string;
    }>;
    digitalResources: Array<{
      title: string;
      type: 'video' | 'audio' | 'document' | 'interactive' | 'other';
      url: string;
      description: string;
    }>;
    supplementaryMaterials: string[];
  };
  assessment: {
    totalMarks: number;
    passingMarks: number;
    components: Array<{
      name: string;
      weight: number;
      type: 'exam' | 'assignment' | 'project' | 'presentation' | 'participation' | 'attendance' | 'other';
      description: string;
    }>;
  };
  status: 'active' | 'inactive' | 'archived';
}

export interface Attendance {
  id: string;
  student: string;
  class: string;
  section: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: 'present' | 'absent' | 'late' | 'excused' | 'sick';
  lateDetails: {
    isLate: boolean;
    lateMinutes?: number;
    reason?: string;
  };
  excuse: {
    reason?: string;
    documentation?: string;
    approvedBy?: string;
    approvedAt?: string;
  };
  markedBy: string;
  notes?: string;
}

export interface Namaz {
  id: string;
  student: string;
  date: string;
  prayers: {
    fajr: {
      performed: boolean;
      location: 'madrassah' | 'home' | 'other';
      time?: string;
      markedBy?: string;
      notes?: string;
    };
    dhuhr: {
      performed: boolean;
      location: 'madrassah' | 'home' | 'other';
      time?: string;
      markedBy?: string;
      notes?: string;
    };
    asr: {
      performed: boolean;
      location: 'madrassah' | 'home' | 'other';
      time?: string;
      markedBy?: string;
      notes?: string;
    };
    maghrib: {
      performed: boolean;
      location: 'madrassah' | 'home' | 'other';
      time?: string;
      markedBy?: string;
      notes?: string;
    };
    isha: {
      performed: boolean;
      location: 'madrassah' | 'home' | 'other';
      time?: string;
      markedBy?: string;
      notes?: string;
    };
  };
  summary: {
    totalPerformed: number;
    madrassahCount: number;
    homeCount: number;
    missedCount: number;
    percentage: number;
  };
  notifications: {
    parentNotified: boolean;
    teacherNotified: boolean;
    notificationSentAt?: string;
  };
}

export interface IslamicStudies {
  id: string;
  student: string;
  class: string;
  section: string;
  date: string;
  sabaq: {
    surah: {
      name?: string;
      number?: number;
    };
    fromAyah?: number;
    toAyah?: number;
    description?: string;
    teacher?: string;
    performance: 'excellent' | 'good' | 'average' | 'needs_improvement';
    notes?: string;
  };
  sabqi: {
    surah: {
      name?: string;
      number?: number;
    };
    fromAyah?: number;
    toAyah?: number;
    performance: 'excellent' | 'good' | 'average' | 'needs_improvement';
    mistakes: Array<{
      type: string;
      description: string;
    }>;
    notes?: string;
  };
  manzil: {
    surah: {
      name?: string;
      number?: number;
    };
    fromAyah?: number;
    toAyah?: number;
    performance: 'excellent' | 'good' | 'average' | 'needs_improvement';
    notes?: string;
  };
  wordOfTheDay: {
    arabic?: string;
    english?: string;
    urdu?: string;
    meaning?: string;
    context?: string;
    learned: boolean;
  };
  dailyKnowledge: {
    hadith: {
      text?: string;
      reference?: string;
      explanation?: string;
      learned: boolean;
    };
    dua: {
      arabic?: string;
      english?: string;
      urdu?: string;
      context?: string;
      learned: boolean;
    };
    islamicFacts: Array<{
      fact: string;
      category: string;
      learned: boolean;
    }>;
  };
  tajweed: {
    practiced: boolean;
    focus: string[];
    performance: 'excellent' | 'good' | 'average' | 'needs_improvement';
    notes?: string;
  };
  memorization: {
    newVerses: number;
    revisedVerses: number;
    totalMemorized: number;
    target: number;
  };
  overallPerformance: {
    score: number;
    grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
    teacherRemarks?: string;
  };
  markedBy: string;
}

export interface Discipline {
  id: string;
  student: string;
  class: string;
  section: string;
  date: string;
  behaviorPoints: {
    positive: number;
    negative: number;
    net: number;
  };
  behaviorRecords: Array<{
    type: 'positive' | 'negative';
    category: string;
    description: string;
    points: number;
    time: string;
    recordedBy: string;
  }>;
  teacherSatisfaction: {
    level: 'very_satisfied' | 'satisfied' | 'neutral' | 'dissatisfied' | 'very_dissatisfied';
    score: number;
    remarks?: string;
    teacher: string;
  };
  actions: Array<{
    type: 'warning' | 'counseling' | 'parent_notification' | 'detention' | 'suspension' | 'other';
    description?: string;
    takenBy: string;
    takenAt: string;
    status: 'active' | 'resolved' | 'cancelled';
  }>;
  summary: {
    overallBehavior: 'excellent' | 'good' | 'average' | 'poor' | 'concerning';
    improvementAreas: string[];
    strengths: string[];
    recommendations?: string;
  };
  parentCommunication: {
    notified: boolean;
    notificationType?: 'email' | 'sms' | 'phone' | 'in_person';
    notificationSentAt?: string;
    parentResponse?: string;
    parentResponseAt?: string;
  };
}

export interface Fitness {
  id: string;
  student: string;
  class: string;
  section: string;
  date: string;
  measurements: {
    height: {
      value?: number;
      unit: 'cm' | 'ft';
    };
    weight: {
      value?: number;
      unit: 'kg' | 'lbs';
    };
    bmi?: number;
    bmiCategory: 'underweight' | 'normal' | 'overweight' | 'obese';
  };
  activities: Array<{
    type: 'running' | 'walking' | 'cycling' | 'swimming' | 'sports' | 'exercise' | 'other';
    name?: string;
    duration: number;
    intensity: 'low' | 'moderate' | 'high';
    calories?: number;
    notes?: string;
  }>;
  sports: Array<{
    sport: string;
    duration: number;
    performance: 'excellent' | 'good' | 'average' | 'needs_improvement';
    team?: string;
    position?: string;
    achievements: string[];
    notes?: string;
  }>;
  health: {
    generalHealth: 'excellent' | 'good' | 'fair' | 'poor';
    energyLevel: 'high' | 'medium' | 'low';
    sleepQuality: 'excellent' | 'good' | 'fair' | 'poor';
    sleepHours?: number;
    anyInjuries: boolean;
    injuryDetails?: string;
    medications: string[];
    allergies: string[];
  };
  goals: {
    current: Array<{
      type: 'weight_loss' | 'weight_gain' | 'muscle_building' | 'endurance' | 'flexibility' | 'general_fitness';
      description?: string;
      target?: string;
      deadline?: string;
      progress: number;
    }>;
    achievements: Array<{
      goal: string;
      achievedAt: string;
      description?: string;
    }>;
  };
  summary: {
    totalActivityMinutes: number;
    totalCalories: number;
    fitnessScore: number;
    recommendations: string[];
  };
  teacherAssessment: {
    participation: 'excellent' | 'good' | 'average' | 'poor';
    effort: 'excellent' | 'good' | 'average' | 'poor';
    improvement: 'significant' | 'moderate' | 'minimal' | 'none';
    remarks?: string;
    teacher: string;
  };
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  pages: number;
}

export interface DashboardStats {
  overview: {
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
    totalParents: number;
    totalStaff: number;
    recentAdmissions: number;
  };
  performance: {
    attendance: {
      percentage: number;
      totalRecords: number;
      present: number;
      absent: number;
    };
    namaz: {
      percentage: number;
      totalPrayers: number;
      performedPrayers: number;
      missedPrayers: number;
    };
    islamicStudies: {
      averageScore: number;
      totalRecords: number;
    };
    discipline: {
      concerningStudents: number;
      totalRecords: number;
    };
  };
  classes: Array<{
    id: string;
    name: string;
    level: string;
    totalStudents: number;
    maxStudents: number;
    subjectsCount: number;
    sections: number;
  }>;
}

// New interfaces for Deen Soft requirements

export interface Section {
  id: string;
  name: string;
  class: string;
  maxStudents: number;
  currentStudents: number;
  assignedTeacher: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface DailyLearning {
  id: string;
  student: string;
  class: string;
  section: string;
  date: string;
  muatlia: {
    completed: boolean;
    description: string;
    performance: 'excellent' | 'good' | 'average' | 'needs_improvement';
    notes?: string;
  };
  sabaq: {
    surah: {
      name: string;
      number: number;
    };
    fromAyah: number;
    toAyah: number;
    performance: 'excellent' | 'good' | 'average' | 'needs_improvement';
    notes?: string;
  };
  sabqi: {
    surah: {
      name: string;
      number: number;
    };
    fromAyah: number;
    toAyah: number;
    performance: 'excellent' | 'good' | 'average' | 'needs_improvement';
    mistakes: Array<{
      type: string;
      description: string;
    }>;
    notes?: string;
  };
  manzil: {
    surah: {
      name: string;
      number: number;
    };
    fromAyah: number;
    toAyah: number;
    performance: 'excellent' | 'good' | 'average' | 'needs_improvement';
    notes?: string;
  };
  markedBy: string;
}

export interface StudentScoring {
  id: string;
  student: string;
  class: string;
  section: string;
  date: string;
  discipline: {
    points: number; // 0-5
    description: string;
    category: 'behavior' | 'respect' | 'punctuality' | 'cooperation' | 'other';
  };
  uniform: {
    points: number; // 0-5
    description: string;
    issues: string[];
  };
  fitness: {
    points: number; // 0-5
    description: string;
    activities: string[];
  };
  adab: {
    points: number; // 0-5
    description: string;
    aspects: string[];
  };
  dailyLearning: {
    points: number; // 0-5
    description: string;
    areas: string[];
  };
  salah: {
    points: number; // 0-5
    description: string;
    prayers: {
      fajr: boolean;
      dhuhr: boolean;
      asr: boolean;
      maghrib: boolean;
      isha: boolean;
    };
  };
  totalPoints: number; // 0-30
  markedBy: string;
}

export interface ExamType {
  id: string;
  name: string;
  nameArabic: string;
  type: 'monthly' | 'quarterly' | 'half_yearly' | 'annual';
  description?: string;
  weight: number;
  status: 'active' | 'inactive';
}

export interface ParentSuggestion {
  id: string;
  parent: string;
  student: string;
  suggestion: string;
  category: 'academic' | 'behavior' | 'health' | 'general' | 'other';
  status: 'pending' | 'reviewed' | 'implemented' | 'rejected';
  response?: string;
  respondedBy?: string;
  respondedAt?: string;
  createdAt: string;
}

export interface ParentApplication {
  id: string;
  parent: string;
  student: string;
  type: 'leave' | 'transfer' | 'fee_exemption' | 'other';
  subject: string;
  description: string;
  supportingDocuments?: string[];
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  response?: string;
  createdAt: string;
}

export interface NamazTracking {
  id: string;
  student: string;
  date: string;
  fajr: {
    performed: boolean;
    location: 'madrassah' | 'home' | 'other';
    time?: string;
    notes?: string;
  };
  isha: {
    performed: boolean;
    location: 'madrassah' | 'home' | 'other';
    time?: string;
    notes?: string;
  };
  familyInteraction: {
    handKiss: boolean;
    behaviorRating: number; // 1-5 stars
    description?: string;
  };
  newLearning: {
    hadith: {
      learned: boolean;
      text?: string;
      reference?: string;
    };
    sunnah: {
      learned: boolean;
      description?: string;
    };
    other: {
      learned: boolean;
      description?: string;
    };
  };
  weeklyReflection: {
    question: string;
    answer?: string; // 200 words max
    answered: boolean;
  };
  markedBy: string;
}

export interface Report {
  id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'fee' | 'exam' | 'custom';
  title: string;
  description?: string;
  generatedBy: string;
  generatedAt: string;
  data: any;
  filters: {
    dateRange?: {
      start: string;
      end: string;
    };
    classes?: string[];
    sections?: string[];
    students?: string[];
  };
  status: 'generating' | 'completed' | 'failed';
  filePath?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'urgent' | 'exam' | 'holiday' | 'fee' | 'other';
  targetAudience: ('all' | 'students' | 'parents' | 'teachers' | 'staff')[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  publishedBy: string;
  publishedAt: string;
  expiresAt?: string;
  isActive: boolean;
  attachments?: string[];
}

// Enhanced interfaces for Deen Soft comprehensive system

export interface Exam {
  id: string;
  name: string;
  nameArabic: string; // Arabic translation
  type: 'monthly' | 'quarterly' | 'half_yearly' | 'annual';
  classId: string;
  subject: string;
  examDate: string;
  totalMarks: number;
  passingMarks: number;
  duration: number; // in minutes
  instructions?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  remarks?: string;
  position?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Fee {
  id: string;
  studentId: string;
  classId: string;
  feeType: 'monthly' | 'quarterly' | 'annual' | 'admission' | 'exam' | 'other';
  amount: number;
  dueDate: string;
  paidAmount: number;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue' | 'waived';
  paymentMethod?: 'cash' | 'bank_transfer' | 'mobile_banking' | 'other';
  transactionId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherAttendance {
  id: string;
  teacherId: string;
  date: string;
  comingTime?: string;
  leavingTime?: string;
  isPresent: boolean;
  leaveReason?: string;
  leaveType?: 'sick' | 'personal' | 'emergency' | 'other';
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherPerformance {
  id: string;
  teacherId: string;
  evaluatorId: string;
  date: string;
  disciplineScore: number; // 0-5
  attitudeScore: number; // 0-5
  focusScore: number; // 0-5
  description: string;
  recommendations?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'attendance' | 'namaz' | 'discipline' | 'performance' | 'fee' | 'exam' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  readAt?: string;
  actionUrl?: string;
  createdAt: string;
}

export interface InkyResult {
  id: string;
  studentId: string;
  examId: string;
  subject: string;
  inkyMarks: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProgress {
  id: string;
  studentId: string;
  classId: string;
  sectionId: string;
  date: string;
  muatlia: {
    completed: boolean;
    description: string;
    performance: 'excellent' | 'good' | 'average' | 'needs_improvement';
    notes?: string;
  };
  sabaq: {
    surah: {
      name: string;
      number: number;
    };
    fromAyah: number;
    toAyah: number;
    performance: 'excellent' | 'good' | 'average' | 'needs_improvement';
    notes?: string;
  };
  sabqi: {
    surah: {
      name: string;
      number: number;
    };
    fromAyah: number;
    toAyah: number;
    performance: 'excellent' | 'good' | 'average' | 'needs_improvement';
    mistakes: Array<{
      type: string;
      description: string;
    }>;
    notes?: string;
  };
  manzil: {
    surah: {
      name: string;
      number: number;
    };
    fromAyah: number;
    toAyah: number;
    performance: 'excellent' | 'good' | 'average' | 'needs_improvement';
    notes?: string;
  };
  markedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentScore {
  id: string;
  studentId: string;
  classId: string;
  sectionId: string;
  date: string;
  discipline: {
    points: number; // 0-5
    description: string;
    category: 'behavior' | 'respect' | 'punctuality' | 'cooperation' | 'other';
  };
  uniform: {
    points: number; // 0-5
    description: string;
    issues: string[];
  };
  fitness: {
    points: number; // 0-5
    description: string;
    activities: string[];
  };
  adab: {
    points: number; // 0-5
    description: string;
    aspects: string[];
  };
  dailyLearning: {
    points: number; // 0-5
    description: string;
    areas: string[];
  };
  salah: {
    points: number; // 0-5
    description: string;
    prayers: {
      fajr: boolean;
      dhuhr: boolean;
      asr: boolean;
      maghrib: boolean;
      isha: boolean;
    };
  };
  totalPoints: number; // 0-30
  markedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ParentSuggestion {
  id: string;
  parentId: string;
  studentId: string;
  suggestion: string; // Max 200 words
  category: 'academic' | 'behavior' | 'health' | 'general' | 'other';
  status: 'pending' | 'reviewed' | 'implemented' | 'rejected';
  response?: string;
  respondedBy?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ParentApplication {
  id: string;
  parentId: string;
  studentId: string;
  type: 'leave' | 'transfer' | 'fee_exemption' | 'other';
  subject: string;
  description: string;
  supportingDocuments?: string[];
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  response?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NamazTracking {
  id: string;
  studentId: string;
  date: string;
  fajr: {
    performed: boolean;
    location: 'madrassah' | 'home' | 'other';
    time?: string;
    notes?: string;
  };
  isha: {
    performed: boolean;
    location: 'madrassah' | 'home' | 'other';
    time?: string;
    notes?: string;
  };
  newLearning: {
    hadith: {
      learned: boolean;
      text?: string;
      reference?: string;
    };
    sunnah: {
      learned: boolean;
      description?: string;
    };
    other: {
      learned: boolean;
      description?: string;
    };
  };
  familyInteraction: {
    handKiss: boolean;
    behaviorRating: number; // 1-5 stars
    description?: string;
  };
  weeklyReflection: {
    question: string;
    answer?: string; // 200 words max
    answered: boolean;
  };
  markedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'fee' | 'exam' | 'custom';
  title: string;
  description?: string;
  generatedBy: string;
  generatedAt: string;
  data: any;
  filters: {
    dateRange?: {
      start: string;
      end: string;
    };
    classes?: string[];
    sections?: string[];
    students?: string[];
  };
  status: 'generating' | 'completed' | 'failed';
  filePath?: string;
}

export interface SystemSettings {
  id: string;
  key: string;
  value: any;
  description?: string;
  category: 'general' | 'academic' | 'financial' | 'notification' | 'security';
  isActive: boolean;
  updatedBy: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// Enhanced Dashboard Stats
export interface EnhancedDashboardStats {
  overview: {
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
    totalSections: number;
    totalParents: number;
    totalStaff: number;
    recentAdmissions: number;
    activeExams: number;
    pendingFees: number;
  };
  performance: {
    attendance: {
      percentage: number;
      totalRecords: number;
      present: number;
      absent: number;
      late: number;
    };
    namaz: {
      percentage: number;
      totalPrayers: number;
      performedPrayers: number;
      missedPrayers: number;
      fajrPercentage: number;
      ishaPercentage: number;
    };
    islamicStudies: {
      averageScore: number;
      totalRecords: number;
      muatliaCompletion: number;
      sabaqProgress: number;
      sabqiProgress: number;
      manzilProgress: number;
    };
    discipline: {
      concerningStudents: number;
      totalRecords: number;
      averageScore: number;
    };
    scoring: {
      averageTotalScore: number;
      excellentStudents: number; // 25-30 points
      goodStudents: number; // 20-24 points
      averageStudents: number; // 15-19 points
      needsImprovement: number; // 0-14 points
    };
  };
  financial: {
    totalFees: number;
    collectedFees: number;
    pendingFees: number;
    overdueFees: number;
    monthlyRevenue: number;
  };
  teacher: {
    presentToday: number;
    absentToday: number;
    averagePerformance: number;
    totalTeachers: number;
  };
  classes: Array<{
    id: string;
    name: string;
    level: string;
    totalStudents: number;
    maxStudents: number;
    subjectsCount: number;
    sections: number;
    averageAttendance: number;
    averagePerformance: number;
  }>;
}
